import { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { sign, verify } from 'hono/jwt';
import { SignatureAlgorithm } from 'hono/utils/jwt/jwa';

import { SessionPayloadSchema, SessionPayloadSchemaType } from '@hyperlog/shared';

import { env } from '../env.ts';
import { App } from './types.ts';

export type ServerSession = Awaited<ReturnType<typeof createNewSession>>;

/** Session cookie name */
export const SESSION_COOKIE = 'hyperlog-session';

/** Average session time per IT */
export const TWENTY_EIGHT_MINUTES_IN_MS = 28 * 60000;

/** Encryption algorithm */
export const ALGORITHM: SignatureAlgorithm = 'HS256';

export async function createNewSession(data: SessionPayloadSchemaType['user']) {
  const issuedAt = Date.now();
  const expiration = issuedAt + TWENTY_EIGHT_MINUTES_IN_MS;

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

export function setSessionCookie(session: ServerSession, ctx: Context<App>) {
  setCookie(ctx, SESSION_COOKIE, session.token, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'Lax',
    expires: new Date(session.payload.exp),
  });
}
