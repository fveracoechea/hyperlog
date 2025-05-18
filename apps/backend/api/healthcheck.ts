import { Hono } from "hono";
import { sql } from "drizzle-orm";

import { AppEnv } from "@/utils/types.ts";
import { db } from "@/db/db.ts";

const app = new Hono<AppEnv>()
  /**
   * Healthcheck
   */
  .get("/", async (ctx) => {
    let connected = false;

    try {
      console.log(await db.query.collection.findMany());
      await db.run(sql`SELECT 1`);
      connected = true;
    } catch {
      // no operation
    }

    const time = `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`;

    if (!connected) {
      return ctx.var.error({ message: `Database connection failed - ${time}` });
    }

    return ctx.var.success({ message: `Status OK: ${time}` });
  });

export default app;
