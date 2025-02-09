/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable no-process-env */
import process from 'node:process';
import { z } from 'zod';

const EnvSchema = z
  .object({
    BACKEND_PORT: z.coerce.number().default(3333),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    // DB_FILENAME: z.string(),
    SALT_ROUNDS: z.coerce.number().default(12),
    ALLOWED_ROUTES: z
      .string()
      .transform(arg => arg.split(','))
      .default(''),
    SECRET_KEY: z
      .string()
      .optional()
      .transform((arg, ctx) => {
        if (!arg) {
          if (process.env.NODE_ENV === 'production') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'SECRET_KEY',
            });
            return z.NEVER;
          }
          return 'secret';
        }
        return arg;
      }),
  })
  .transform(v => ({
    ...v,
    isDev: v.NODE_ENV === 'development',
    isProd: v.NODE_ENV === 'production',
  }));

export type EnvVars = z.infer<typeof EnvSchema>;

let values = null;

try {
  values = EnvSchema.parse(process.env);
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

export const env = values as EnvVars;
