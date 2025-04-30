import { Hono } from "hono";
import { AppEnv } from "@/utils/types.ts";
import { sessionMiddleware } from "@/middlewares/session.ts";
import { db, schema } from "@/db/db.ts";
import { eq } from "drizzle-orm";

const app = new Hono<AppEnv>()
  .use(sessionMiddleware)
  /**
   * List all tags
   * */
  .get("/", async (c) => {
    const tags = await db.query.tag.findMany({
      where: eq(schema.tag.ownerId, c.var.user.id),
    });
    return c.var.success({ tags });
  });

export default app;
