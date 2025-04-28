import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import { auth } from "@/utils/auth.ts";
import { AppEnv } from "@/utils/types.ts";

export function getAuthenticationError(message?: string) {
  return new HTTPException(401, {
    message:
      message ?? "You must be logged in to access this resource. Please login to continue.",
  });
}

export const sessionMiddleware = createMiddleware<AppEnv>(async (ctx, next) => {
  const session = await auth.api.getSession({ headers: ctx.req.raw.headers });

  if (!session) {
    throw getAuthenticationError();
  }

  ctx.set("user", session.user);
  ctx.set("session", session.session);

  return next();
});
