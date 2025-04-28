import { Hono } from "hono";
import apiRoutes from "@/api/_api.ts";

const app = new Hono()
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/api", apiRoutes);

export type HonoApp = typeof app;

Deno.serve(app.fetch);
