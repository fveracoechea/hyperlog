import { Hono } from "hono";
import { auth } from "@/utils/auth.ts";

const app = new Hono();

export default app.on(["POST", "GET", "OPTIONS"], "/*", (ctx) => {
  return auth.handler(ctx.req.raw);
});
