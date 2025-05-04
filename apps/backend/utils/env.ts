import "@std/dotenv/load";

import { z } from "zod";

const zSecret = z
  .string()
  .optional()
  .transform((arg, ctx) => {
    if (!arg) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: ctx.path.join("_") });
      return z.NEVER;
    }
    return arg;
  });

const EnvSchema = z
  .object({
    // BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
    MODE: z.enum(["development", "production"]).default("development"),
    DB_FILENAME: z.string(),
    COOKIE_SECRET: zSecret,
    BETTER_AUTH_SECRET: zSecret,
    CORS_ORIGIN: z.string().url().default("http://localhost:8080"),
    PORT: z.number().default(8080),
  })
  .transform((v) => ({
    ...v,
    isDev: v.MODE === "development",
    isProd: v.MODE === "production",
  }));

export type EnvVars = z.infer<typeof EnvSchema>;

function loadEnv() {
  try {
    return EnvSchema.parse(Deno.env.toObject());
  } catch (error) {
    if (error instanceof z.ZodError) {
      let message = "Missing required ENV variables: \n";
      error.issues.forEach((issue) => {
        message += `- ${issue.path[0]} \n`;
      });
      const e = new Error(message);
      throw e;
    } else {
      throw error;
    }
  }
}

export const env = loadEnv();
