import { Hono } from "hono";
import { auth } from "@/utils/auth.ts";
import { AppEnv } from "@/utils/types.ts";

const app = new Hono<AppEnv>().on(["POST", "GET", "OPTIONS"], "/*", (ctx) => {
  return auth.handler(ctx.req.raw);
});

export default app;
