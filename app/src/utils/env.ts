import { z } from 'zod';

const zSecret = z
  .string()
  .optional()
  .transform((arg, ctx) => {
    if (!arg) {
      if (import.meta.env.PROD) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: ctx.path.join('_') });
        return z.NEVER;
      }
      return 'secret';
    }
    return arg;
  });

const EnvSchema = z
  .object({
    BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    DB_FILENAME: z.string(),
    COOKIE_SECRET: zSecret,
    BETTER_AUTH_SECRET: zSecret,
  })
  .transform(v => ({
    ...v,
    isDev: v.NODE_ENV === 'development',
    isProd: v.NODE_ENV === 'production',
  }));

export type EnvVars = z.infer<typeof EnvSchema>;

function loadEnv() {
  try {
    return EnvSchema.parse(import.meta.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      let message = 'Missing required ENV variables: \n';
      error.issues.forEach(issue => {
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
