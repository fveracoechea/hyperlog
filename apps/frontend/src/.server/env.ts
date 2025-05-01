import { z } from 'zod';

const zSecret = z
  .string()
  .optional()
  .transform((arg, ctx) => {
    if (!arg) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: ctx.path.join('_') });
      return z.NEVER;
    }
    return arg;
  });

const EnvSchema = z
  .object({
    BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),
    MODE: z.enum(['development', 'production']).default('development'),
    DB_FILENAME: z.string(),
    COOKIE_SECRET: zSecret,
    BETTER_AUTH_SECRET: zSecret,
  })
  .transform((v) => ({
    ...v,
    isDev: v.MODE === 'development',
    isProd: v.MODE === 'production',
  }));

export type EnvVars = z.infer<typeof EnvSchema>;

function loadEnv() {
  try {
    return EnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      let message = 'Missing required ENV variables: \n';
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
