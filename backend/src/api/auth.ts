/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';
import { eq, or } from 'drizzle-orm';

import { LoginSchema, SignupSchema } from '@hyperlog/shared';

import { db } from '../db/db.ts';
import { users } from '../db/schema.ts';
import { createHasher, validatePassword } from '../utils/hasher.ts';
import { createNewSession, setSessionCookie } from '../utils/session.ts';
import { App } from '../utils/types.ts';

async function findFirstUserByUsername(username: string) {
  return await db.query.users.findFirst({
    where: or(
      // look-up by email and username
      eq(users.email, username),
      eq(users.username, username),
    ),
  });
}

const app = new Hono<App>()
  /*
   * Sign Up
   * Reserved for internal FrontDoor users
   * */
  .post('/sign-up', zValidator('json', SignupSchema), async ctx => {
    const input = ctx.req.valid('json');

    const user = await findFirstUserByUsername(input.username);
    if (user) return ctx.var.error({ message: 'Email or Username already in use.' }, 409);

    // NOTE: FrontDoor client-id for internal Users
    const clientId = 1;

    const {
      verifyPassword: _ignore_verifyPassword,
      password: _ignore_password,
      ...userData
    } = input;

    const hashedPassword = await createHasher(input.password);

    const result = await db
      .insert(users)
      .values({ ...userData, clientId, password: hashedPassword })
      .returning();

    const { password: _do_not_send_password, ...payload } = result[0];

    const session = await createNewSession(payload);
    setSessionCookie(session, ctx);

    return ctx.var.success({ session: session.payload });
  })
  /*
   * Login
   * Reserved for internal FrontDoor users
   * */
  .post('/login', zValidator('json', LoginSchema), async ctx => {
    const message =
      'Invalid credentials. Please check your username, or password and try again.';

    const input = ctx.req.valid('json');

    const user = await findFirstUserByUsername(input.username);
    if (!user) return ctx.var.error({ message }, 401);

    const validation = await validatePassword(input.password, user.password);
    if (!validation) return ctx.var.error({ message }, 401);

    const { password: _do_not_send_to_client, ...payload } = user;

    const session = await createNewSession(payload);
    setSessionCookie(session, ctx);

    return ctx.var.success({ session: session.payload });
  })
  /*
   * Single Sing On
   * Reserved for VMS users
   * */
  .post('/sso', async ctx => {
    // TODO: Implement SSO
    return ctx.var.success({ session: null });
  });

export default app;
