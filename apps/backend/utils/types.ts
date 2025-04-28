import { ErrorResponseHandler, SuccessResponseHandler } from "@/middlewares/jsonResponse.ts";
import { auth } from "@/utils/auth.ts";

export type AppEnv = {
  Variables: {
    success: SuccessResponseHandler;
    error: ErrorResponseHandler;
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};
