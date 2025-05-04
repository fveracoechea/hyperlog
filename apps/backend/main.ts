import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { StatusCode } from "hono/utils/http-status";
import { HTTPException } from "hono/http-exception";

import apiRoutes from "@/api/_main.ts";
import { AppEnv } from "@/utils/types.ts";
import { jsonResponseMiddleware } from "@/middlewares/jsonResponse.ts";
import { env } from "@/utils/env.ts";

const app = new Hono<AppEnv>()
  .use("*", jsonResponseMiddleware)
  .use(cors({
    origin: "http://localhost:3000", // replace with your origin
    credentials: true,
  }))
  .use(logger())
  .route("/api", apiRoutes)
  .notFound((ctx) =>
    ctx.var.error(
      {
        message: "The requested resource was not found.",
        url: ctx.req.url,
      },
      404,
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
