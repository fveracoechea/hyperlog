import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import {
  createNewSession,
  getSessionCookie,
  setSessionCookie,
  verifySession,
} from '../utils/session.ts';
import { App } from '../utils/types.ts';

function getAuthenticationError(message?: string) {
  return new HTTPException(401, {
    message:
      message ?? 'You must be logged in to access this resource. Please login to continue.',
  });
}

/**
 * Validates and updates session
 *
 * @example
 * ```ts
 * ctx.var.session;
 * ```
 * */
export const sessionMiddleware = createMiddleware<App>(async (ctx, next) => {
  try {
    // get session token
    const sessionToken = await getSessionCookie(ctx);
    if (!sessionToken) throw getAuthenticationError();

    // verify current session
    const currentSession = await verifySession(sessionToken);

    // extend the session for 28 minutes
    const newSession = await createNewSession(currentSession.user);
    await setSessionCookie(newSession, ctx);

    // store session in the hono context
    ctx.set('session', newSession.payload);
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw getAuthenticationError('Your session has expired. Please log in again to continue.');
  }

  await next();
});
