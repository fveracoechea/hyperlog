import { Hono } from "hono";
import { cors } from "hono/cors";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, username } from "better-auth/plugins";

import { db } from "@/db/db.ts";
import { AppEnv } from "@/utils/types.ts";

/**
 * pnpx @better-auth/cli@latest generate --config src/.server/auth.ts --output src/.server/schema/auth-schema.ts
 */
export const auth = betterAuth({
  plugins: [username(), admin()],
  database: drizzleAdapter(db, { provider: "sqlite" }),
  trustedOrigins: ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  user: {
    additionalFields: {
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
      },
    },
  },
});

export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session.session;

const app = new Hono<AppEnv>()
  .use(
    "/*",
    cors({
      origin: "http://localhost:3000", // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .on(["POST", "GET", "OPTIONS"], "/*", (ctx) => {
    return auth.handler(ctx.req.raw);
  });

export default app;
