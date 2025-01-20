import { Hono } from 'hono';

import { sessionMiddleware } from '../middlewares/session.ts';
import { App } from '../utils/types.ts';

const app = new Hono<App>()
  .use(sessionMiddleware)
  /*
   * GET authenticated user data (find-one)
   * */
  .get('/whoami', async ctx => {
    const session = ctx.var.session;
    return ctx.var.success({ session });
  });

export default app;
