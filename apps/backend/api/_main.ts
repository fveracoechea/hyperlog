import { Hono } from "hono";

import auth from "./auth.ts";
import healthcheck from "./healthcheck.ts";
import collection from "./collection.ts";
import { AppEnv } from "@/utils/types.ts";

const app = new Hono<AppEnv>()
  // Public routes
  .route("/auth", auth)
  .route("/healthcheck", healthcheck)
  // Private routes
  .route("/collection", collection);

export default app;
