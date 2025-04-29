import { Env } from "hono";
import { ErrorResponseHandler, SuccessResponseHandler } from "@/middlewares/jsonResponse.ts";
import { auth } from "@/utils/auth.ts";

export interface AppEnv extends Env {
  Variables: {
    success: SuccessResponseHandler;
    error: ErrorResponseHandler;
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
}
