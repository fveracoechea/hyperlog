import { Context } from 'hono';
import { deleteCookie, getSignedCookie, setSignedCookie } from 'hono/cookie';
import { sign, verify } from 'hono/jwt';
import { SignatureAlgorithm } from 'hono/utils/jwt/jwa';

import { SessionPayloadSchema, SessionPayloadSchemaType } from '@hyperlog/shared';

import { env } from '../env.ts';
import { App } from './types.ts';

export type ServerSession = Awaited<ReturnType<typeof createNewSession>>;

/** Session cookie name */
export const SESSION_COOKIE = 'hyperlog-session';

/** Cookie session expiration */
export const TWO_HOURS_IN_SECONDS = 60 * 60 * 2;

/** JWT session time required by IT */
export const TWENTY_EIGHT_MINUTES_IN_SECONDS = 28 * 60;

/** Average session time per IT */
export const TWENTY_EIGHT_MINUTES_IN_MS = 28 * 60000;

/** Encryption algorithm */
export const ALGORITHM: SignatureAlgorithm = 'HS256';

export async function createNewSession(data: SessionPayloadSchemaType['user']) {
  // time value in seconds
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiration = issuedAt + TWENTY_EIGHT_MINUTES_IN_SECONDS;

  const payload = {
    user: data,
    exp: expiration,
    iat: issuedAt,
  };

  const token = await sign(payload, env.SECRET_KEY, ALGORITHM);

  return { token, payload };
}

/**
 * Validates a given token
 * @throws `ZodError`
 * @throws `JwtTokenInvalid`
 * */
export async function verifySession(token: string) {
  const payload = await verify(token, env.SECRET_KEY, ALGORITHM);
  return SessionPayloadSchema.parse(payload);
}

export function getSessionCookie(ctx: Context<App>) {
  return getSignedCookie(ctx, env.SECRET_KEY, SESSION_COOKIE);
}

export function deleteSessionCookie(ctx: Context<App>) {
  return deleteCookie(ctx, SESSION_COOKIE, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'Lax',
  });
}

export async function setSessionCookie(session: ServerSession, ctx: Context<App>) {
  // set a longer cookie expiration so we can check if JWT session expired
  const expires = new Date((session.payload.iat + TWO_HOURS_IN_SECONDS) * 1000);
  await setSignedCookie(ctx, SESSION_COOKIE, session.token, env.SECRET_KEY, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'Lax',
    expires,
  });
}
