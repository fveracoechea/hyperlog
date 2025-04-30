import { Hono } from "hono";
import { cors } from "hono/cors";
import { StatusCode } from "hono/utils/http-status";
import { HTTPException } from "hono/http-exception";

import apiRoutes from "@/api/_main.ts";
import { AppEnv } from "@/utils/types.ts";
import { jsonResponseMiddleware } from "@/middlewares/jsonResponse.ts";
import { env } from "@/utils/env.ts";

const app = new Hono<AppEnv>()
  .use("*", jsonResponseMiddleware)
  .use(
    "*",
    cors({
      origin: env.CORS_ORIGIN,
      allowHeaders: ["Content-Type", "Authorization", "Accept"],
      allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  )
  .route("/api", apiRoutes)
  .notFound((ctx) =>
    ctx.var.error(
      {
        message: "The requested resource was not found.",
        url: ctx.req.url,
      },
      404
    )
  )
  .onError((err, ctx) => {
    console.log("-- Server Error --");
    console.log(err);

    let status: StatusCode = 500;
    let message = "Oops, an unexpected error occurred.";

    if (err instanceof HTTPException) {
      status = err.status;
      message = err.message;
    }

    return ctx.var.error({ message, status }, status);
  });

export type HonoApp = typeof app;

Deno.serve({ port: env.PORT }, app.fetch);
