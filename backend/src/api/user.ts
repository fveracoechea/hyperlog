import { Hono } from 'hono';

import { eq } from 'drizzle-orm';

import { db } from '../db/db.ts';
import { users } from '../db/schema.ts';
import { sessionMiddleware } from '../middlewares/session.ts';
import { App } from '../utils/types.ts';

const app = new Hono<App>()
  .use(sessionMiddleware)
  /*
   * GET authenticated user data (find-one)
   * */
  .get('/whoami', async ctx => {
    const session = ctx.var.session;

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      with: {
        client: true,
      },
    });

    return ctx.var.success({ user });
  });

export default app;
