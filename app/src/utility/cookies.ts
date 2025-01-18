import { type CookieOptions, createCookie } from 'react-router';

import { env } from '@/utility/env';
import { z } from 'zod';

function makeCookie<S extends z.ZodTypeAny>(
  name: string,
  schema: S,
  options: Omit<CookieOptions, 'secrets'> = {},
) {
  const {
    sameSite = 'lax',
    httpOnly = true,
    secure = import.meta.env.PROD,
    maxAge = 8 * 24 * 60 * 60, // 8 days
    ...otherOptions
  } = options;

  const cookie = createCookie(name, {
    sameSite,
    httpOnly,
    secure,
    maxAge,
    ...otherOptions,
    secrets: [env.COOKIE_SECRET],
  });

  return {
    async get(request: Request): Promise<z.infer<S>> {
      const payload = await cookie.parse(request.headers.get('Cookie'));
      return await schema.parseAsync(payload);
    },
    set(payload: z.infer<S>) {
      return cookie.serialize(payload);
    },
    delete() {
      return cookie.serialize('', { maxAge: 0 });
    },
  };
}

/**
 * Allow sharing values between Loaders, Actions, and UI
 * */
export const cookies = {
  /** Used to display informative message-callouts */
  info: makeCookie(
    'hyperlog-message',
    z.object({ message: z.string(), type: z.enum(['info', 'destructive']).default('info') }),
    {
      maxAge: 6,
    },
  ),
  /** Allows for redirects to a specific pathname */
  redirect: makeCookie('hyperlog-redirect', z.object({ pathname: z.string() })),
};
