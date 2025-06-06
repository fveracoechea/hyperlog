import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { CreateCollectionSchema, EditCollectionSchema } from "@hyperlog/schemas";

import { AppEnv } from "@/utils/types.ts";
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
  /**
   * GET
   * Retrieve all collections for the user
   * TODO: handle shared collections
   */
  .get("/", zValidator("query", CollectionQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const collections = await getCollections({
      query,
      userId: c.var.user.id,
    });
    return c.var.success({ collections });
  })
  /**
   * GET
   * Retrieve collection details by ID
   */
  .get(
    "/:collectionId",
    zValidator("param", z.object({ collectionId: z.string() })),
    zValidator(
      "query",
      z.object({ tag: z.string().optional() }).optional(),
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const { tag } = c.req.valid("query") ?? {};

      const [result, error] = await getCollectionDetails(c.var.user.id, collectionId, tag);
      if (error) return c.var.error({ message: error.message }, error.status);
      return c.var.success(result);
    },
  )
  /**
   * POST
   * Create a new collection
   */
  .post("/", zValidator("json", CreateCollectionSchema), async (c) => {
    try {
      const input = c.req.valid("json");
      const [collection] = await db
        .insert(schema.collection)
        .values({ ...input, ownerId: c.var.user.id })
        .returning();

      return c.var.success({ collection });
    } catch (error) {
      if (isSQLiteErrorCode(error, "SQLITE_CONSTRAINT_UNIQUE")) {
        return c.var.error(
          {
            message: "Collection name is already in use. Try a different one.",
          },
          400,
        );
      }
      console.warn("CREATE COLLECTION ERROR");
      console.error(error);
      throw new HTTPException(500, { cause: error });
    }
  })
  /**
   * DELETE
   * Delete a collection by ID
   */
  .delete(
    "/:collectionId",
    zValidator("param", z.object({ collectionId: z.string().uuid() })),
    zValidator("json", z.object({ deleteLinks: z.boolean().optional() })),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const { deleteLinks } = c.req.valid("json");

      const result = await validateCollectionAccess(
        collectionId,
        c.var.user.id,
      );

      if (result.error) return c.var.error(result.error, result.error.code);

      await db.transaction(async (tx) => {
        if (deleteLinks) {
          await tx.delete(schema.link).where(eq(schema.link.collectionId, collectionId));
        }

        await tx.delete(schema.collection).where(eq(schema.collection.id, collectionId));
      });

      return c.var.success({
        message: "Collection deleted successfully.",
        collection: result.data,
      });
    },
  )
  /**
   * PUT
   * Edit a collection by ID
   */
  .put(
    "/:collectionId",
    zValidator("param", z.object({ collectionId: z.string().uuid() })),
    zValidator("json", EditCollectionSchema),
    async (c) => {
      const formData = c.req.valid("json");
      const { collectionId } = c.req.valid("param");

      const result = await validateCollectionAccess(collectionId, c.var.user.id);
      if (result.error) return c.var.error(result.error, result.error.code);

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
    },
  );

export default app;
