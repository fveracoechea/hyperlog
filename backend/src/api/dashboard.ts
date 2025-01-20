import { Hono } from 'hono';

import { eq } from 'drizzle-orm';

import { db } from '../db/db.ts';
import * as schema from '../db/schema.ts';
import { sessionMiddleware } from '../middlewares/session.ts';
import { App } from '../utils/types.ts';

const app = new Hono<App>()
  .use(sessionMiddleware)
  /*
   * GET layout data for active session (find-many)
   * */
  .get('/layout', async ctx => {
    const session = ctx.var.session;

    const data = await db.query.users.findFirst({
      where: eq(schema.users.id, session.user.id),
      with: {
        collections: { with: { collection: true } },
        tags: true,
      },
    });

    return ctx.var.success({
      collections: data?.collections.map(c => c.collection),
      tags: data?.tags,
    });
  });

export default app;
