import { Hono } from "hono";
import { AppEnv } from "../utils/types.ts";
import { db, schema } from "../db/db.ts";
import { eq } from "drizzle-orm";

const app = new Hono<AppEnv>()
  /**
   * Who Am I?
   */
  .get("/", (c) => {
    const user = c.get("user");
    return c.var.success({ user });
  })
  /**
   * GET
   * Stats
   */
  .get("/stats", async (c) => {
    const user = c.get("user");

    const [links, collections, tags] = await Promise.all([
      db.$count(schema.link, eq(schema.link.ownerId, user.id)),
      db.$count(schema.collection, eq(schema.collection.ownerId, user.id)),
      db.$count(schema.tag, eq(schema.tag.ownerId, user.id)),
    ]);

    return c.var.success({ count: { links, collections, tags } });
  });

export default app;
