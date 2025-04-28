import { Hono } from "hono";

import auth from "./auth.ts";
import healthcheck from "./healthcheck.ts";
import { AppEnv } from "@/utils/types.ts";

const app = new Hono<AppEnv>()
  // Public routes
  .route("/auth", auth)
  .route("/healthcheck", healthcheck);

export default app;
