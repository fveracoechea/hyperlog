import { z } from 'zod';

const EnvSchema = z.object({
  VITE_BACKEND_URL: z.string().url().default('http://localhost:3333/'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  COOKIE_SECRET: z
    .string()
    .optional()
    .transform((arg, ctx) => {
      if (!arg) {
        if (import.meta.env.PROD) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'COOKIE_SECRET',
          });
          return z.NEVER;
        }
        return 'secret';
      }

      return arg;
    }),
});

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
