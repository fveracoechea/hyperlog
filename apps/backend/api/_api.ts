import { Hono } from "hono";

import authRoutes from "./auth.ts";

const app = new Hono()
  // Public routes
  .route("/auth", authRoutes);

export default app;
