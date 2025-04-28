import { type CookieOptions, createCookie, createCookieSessionStorage } from 'react-router';

import { env } from '@/.server/env';
import { createThemeSessionResolver } from 'remix-themes';
import { createTypedCookie } from 'remix-utils/typed-cookie';
import { z } from 'zod';

const cookieOptions: CookieOptions = {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secure: import.meta.env.PROD,
  secrets: [env.COOKIE_SECRET],
};

/**
 * Allow sharing values between Loaders, Actions, and UI
 * */
export const cookies = {
  /** Used to display informative message-callouts */
  info: createTypedCookie({
    cookie: createCookie('hyperlog-message', { ...cookieOptions, maxAge: 3 }),
    schema: z
      .object({ message: z.string(), type: z.enum(['info', 'destructive']).default('info') })
      .nullable(),
  }),
  theme: createCookieSessionStorage({ cookie: { ...cookieOptions, name: 'hyperlog-theme' } }),
};

export const themeSessionResolver = createThemeSessionResolver(cookies.theme);
