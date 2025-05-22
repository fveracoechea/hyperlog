import { Hono } from "hono";
import { AppEnv } from "../utils/types.ts";

const app = new Hono<AppEnv>()
  /**
   * Who Am I?
   */
  .get("/", (c) => {
    const user = c.get("session");
    return c.var.success({ user });
  });

export default app;
