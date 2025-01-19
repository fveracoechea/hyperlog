import { Hono } from 'hono';

import { and, eq } from 'drizzle-orm';

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

    await new Promise(r => setTimeout(r, 500));

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
  })
  /*
   * GET homepage data for active session (find-many)
   * */
  .get('/home', async ctx => {
    const session = ctx.var.session;

    const favorites = await db.query.links.findMany({
      where: and(eq(schema.links.ownerId, session.user.id), eq(schema.links.isPinned, true)),
    });

    return ctx.var.success({
      favorites,
    });
  });

export default app;
