import { Hono } from "hono";
import { AppEnv } from "@/utils/types.ts";
import { sessionMiddleware } from "@/middlewares/session.ts";
import { db, isSQLiteErrorCode, schema } from "@/db/db.ts";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

import { CreateTagSchema, EditTagSchema } from "@hyperlog/schemas";
import { z } from "zod";
import { updateTagLinks, validateTagAccess } from "../utils/tags.ts";

const app = new Hono<AppEnv>()
  .use(sessionMiddleware)
  /**
   * List all tags
   */
  .get("/", async (c) => {
    const tags = await db.query.tag.findMany({
      where: eq(schema.tag.ownerId, c.var.user.id),
      with: { links: { columns: { id: true } } },
    });
    return c.var.success({ tags });
  })
  /**
   * GET
   * Tag Details by Id
   */
  .get("/:tagId", zValidator("param", z.object({ tagId: z.string() })), async (c) => {
    const { tagId } = c.req.valid("param");

    const tag = await db.query.tag.findFirst({
      where: eq(schema.tag.id, tagId),
      with: { links: { with: { collection: true } } },
    });

    if (!tag) return c.var.error({ message: "Tag not found" }, 404);

    return c.var.success({ tag });
  })
  /**
   * POST
   * Create Tag
   */
  .post("/", zValidator("json", CreateTagSchema), async (c) => {
    try {
      const user = c.get("user");
      const input = c.req.valid("json");

      const [tag] = await db
        .insert(schema.tag)
        .values({ ...input, ownerId: user.id })
        .returning();

      return c.var.success({ tag });
    } catch (error) {
      if (isSQLiteErrorCode(error, "SQLITE_CONSTRAINT_UNIQUE")) {
        return c.var.error(
          {
            message: "Tag name is already in use. Try a different one.",
          },
          400,
        );
      }
      console.warn("CREATE TAG ERROR");
      console.error(error);
      throw new HTTPException(500, { cause: error });
    }
  })
  /**
   * PUT
   * Edit Tag
   */
  .put(
    "/:tagId",
    zValidator("param", z.object({ tagId: z.string().uuid() })),
    zValidator("json", EditTagSchema),
    async (c) => {
      const user = c.get("user");
      const { tagId } = c.req.valid("param");
      const input = c.req.valid("json");

      const { error } = await validateTagAccess(tagId, user);
      if (error) return c.var.error(error, error.code);

      await db.transaction(async (tx) => {
        const { name, description, links } = input;

        await tx.update(schema.tag)
          .set({ name, description })
          .where(eq(schema.tag.id, tagId));

        await updateTagLinks(tx, tagId, links);
      });

      return c.var.success({ message: "Tag updated successfully" });
    },
  )
  /**
   * DELETE
   * delete tag
   */
  .delete(
    "/:tagId",
    zValidator("param", z.object({ tagId: z.string().uuid() })),
    async (c) => {
      const user = c.get("user");
      const { tagId } = c.req.valid("param");

      const { error } = await validateTagAccess(tagId, user);
      if (error) return c.var.error(error, error.code);

      await db.delete(schema.tag).where(eq(schema.tag.id, tagId));

      return c.var.success({ message: "Tag updated successfully" });
    },
  );

export default app;
