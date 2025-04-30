import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { CreateCollectionSchema, EditCollectionSchema } from "@hyperlog/schemas";

import { AppEnv } from "@/utils/types.ts";
import { sessionMiddleware } from "@/middlewares/session.ts";
import {
  CollectionQuerySchema,
  getCollectionDetails,
  getCollections,
  updateCollectionLinks,
  updateSubCollections,
  validateCollectionAccess,
} from "@/utils/collections.ts";
import z from "zod";
import { db, isSQLiteErrorCode, schema } from "@/db/db.ts";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

const app = new Hono<AppEnv>()
  .use(sessionMiddleware)
  /**
   * GET parent collections
   * */
  .get("/parent", zValidator("query", CollectionQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const collections = await getCollections({ type: "parent", query, userId: c.var.user.id });
    return c.var.success({ collections });
  })
  /**
   * GET child collections
   * */
  .get("/child", zValidator("query", CollectionQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const collections = await getCollections({ type: "child", query, userId: c.var.user.id });
    return c.var.success({ collections });
  })
  /**
   * TODO:
   * GET shared collections
   * */
  .get("/shared", (c) => {
    return c.var.success({ collections: [] });
  })
  /**
   * GET collection details
   * */
  .get(
    "/:collectionId",
    zValidator("param", z.object({ collectionId: z.string().uuid() })),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const [result, error] = await getCollectionDetails(c.var.user.id, collectionId);
      if (error) return c.var.error({ message: error.message }, error.status);
      return c.var.success(result);
    }
  )
  /**
   * Create new collection
   * */
  .post("/", zValidator("form", CreateCollectionSchema), async (c) => {
    try {
      const formData = c.req.valid("form");
      const [collection] = await db
        .insert(schema.collection)
        .values({ ...formData, ownerId: c.var.user.id })
        .returning();

      return c.var.success({ collection });
    } catch (error) {
      if (isSQLiteErrorCode(error, "SQLITE_CONSTRAINT_UNIQUE")) {
        return c.var.error(
          {
            message: "Collection name is already in use. Try a different one.",
          },
          400
        );
      }
      console.warn("CREATE COLLECTION ERROR");
      console.error(error);
      throw new HTTPException(500, { cause: error });
    }
  })
  /**
   * Delete collection
   * */
  .delete(
    "/:collectionId",
    zValidator("param", z.object({ collectionId: z.string().uuid() })),
    async (c) => {
      const { collectionId } = c.req.valid("param");

      const [message, status] = await validateCollectionAccess(collectionId, c.var.user.id);
      if (message) return c.var.error({ message }, status);

      await db.delete(schema.collection).where(eq(schema.collection.id, collectionId));

      return c.var.success({ message: "Collection deleted successfully." });
    }
  )
  /**
   * Edit collection
   * */
  .put(
    "/:collectionId",
    zValidator("param", z.object({ collectionId: z.string().uuid() })),
    zValidator("form", EditCollectionSchema),
    async (c) => {
      const formData = c.req.valid("form");
      const { collectionId } = c.req.valid("param");

      const [message, status] = await validateCollectionAccess(collectionId, c.var.user.id);
      if (message) return c.var.error({ message }, status);

      await db.transaction(async (tx) => {
        const { subCollections, links, ...edit } = formData;
        await tx
          .update(schema.collection)
          .set(edit)
          .where(eq(schema.collection.id, collectionId));
        await updateCollectionLinks(tx, collectionId, links);
        await updateSubCollections(tx, collectionId, c.var.user.id, subCollections);
      });

      return c.var.success({ message: "Collection updated successfully." });
    }
  );
export default app;
