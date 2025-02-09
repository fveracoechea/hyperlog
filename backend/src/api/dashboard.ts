import { Hono } from 'hono';

import { db, schema } from '@hyperlog/db';
import { eq } from 'drizzle-orm';

import { sessionMiddleware } from '../middlewares/session.ts';
import { App } from '../utils/types.ts';

const app = new Hono<App>()
  .use(sessionMiddleware)
  /*
   * GET layout data for active session (find-many)
   * */
  .get('/sidebar', async ctx => {
    const session = ctx.var.session;

    const data = await db.query.users.findFirst({
      where: eq(schema.users.id, session.user.id),
      with: {
        collections: { with: { collection: true } },
        tags: true,
      },
    });

    return ctx.var.success({
      session,
      collections: data?.collections.map(c => c.collection),
      tags: data?.tags,
    });
  });

export default app;
