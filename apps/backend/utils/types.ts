import { Env } from "hono";
import { ErrorResponseHandler, SuccessResponseHandler } from "@/middlewares/jsonResponse.ts";
import type { AuthSession, AuthUser } from "@/api/auth.ts";

export interface AppEnv extends Env {
  Variables: {
    success: SuccessResponseHandler;
    error: ErrorResponseHandler;
    user: AuthUser;
    session: AuthSession;
  };
}
