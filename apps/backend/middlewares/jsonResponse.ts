import { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { Result } from "../utils/result.ts";

function makeSuccessResponseHandler(ctx: Context) {
  return <D, S extends ContentfulStatusCode>(data: D, status?: S) =>
    ctx.json(Result.ok(data), status);
}

function makeErrorResponseHandler(ctx: Context) {
  return <E, S extends ContentfulStatusCode>(error: E, status?: S) =>
    ctx.json(Result.err(error), status);
}

export type ErrorResponseHandler = ReturnType<typeof makeErrorResponseHandler>;
export type SuccessResponseHandler = ReturnType<typeof makeSuccessResponseHandler>;

/**
 * Consistent JSON formats for API responses
 * Based on `zod.safeParse`
 *
 * @example
 * ```ts
 * return ctx.var.success(data);
 * return ctx.var.error({ message: "No record found" }, 404)
 * ```
 */
export const jsonResponseMiddleware = createMiddleware<{
  Variables: {
    success: SuccessResponseHandler;
    error: ErrorResponseHandler;
  };
}>(async (ctx, next) => {
  ctx.set("success", makeSuccessResponseHandler(ctx));
  ctx.set("error", makeErrorResponseHandler(ctx));
  await next();
});
