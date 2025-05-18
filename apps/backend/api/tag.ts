import { Hono } from "hono";
import { AppEnv } from "@/utils/types.ts";
import { sessionMiddleware } from "@/middlewares/session.ts";
import { db, isSQLiteErrorCode, schema } from "@/db/db.ts";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

import { CreateTagSchema } from "@hyperlog/schemas";

const app = new Hono<AppEnv>()
  .use(sessionMiddleware)
  /**
   * List all tags
   */
  .get("/", async (c) => {
    const tags = await db.query.tag.findMany({
      where: eq(schema.tag.ownerId, c.var.user.id),
    });
    return c.var.success({ tags });
  })
  /**
   * POST
   * Create Tag
   */
  .post("/", zValidator("json", CreateTagSchema), async (c) => {
    try {
      const input = c.req.valid("json");

      const [tag] = await db
        .insert(schema.tag)
        .values({ ...input, ownerId: c.var.user.id })
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
  });

export default app;
