import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';
import { and, asc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '../db/db.ts';
import * as schema from '../db/schema.ts';
import { sessionMiddleware } from '../middlewares/session.ts';
import { App } from '../utils/types.ts';

const app = new Hono<App>()
  .use(sessionMiddleware)
  /*
   * GET favorite links for active session (find-many)
   * */
  .get('/favorites', async ctx => {
    const session = ctx.var.session;

    const favorites = await db.query.links.findMany({
      where: and(eq(schema.links.ownerId, session.user.id), eq(schema.links.isPinned, true)),
      with: {
        tag: true,
      },
    });

    return ctx.var.success({
      favorites,
    });
  })
  /*
   * GET most recently visited links for active session (find-many)
   * */
  .get('/recents', async ctx => {
    const session = ctx.var.session;

    const recentlyViewed = await db.query.links.findMany({
      where: and(eq(schema.links.ownerId, session.user.id)),
      orderBy: [asc(schema.links.lastVisit)],
      limit: 12,
      with: {
        tag: true,
        collection: true,
      },
    });

    return ctx.var.success({
      recentlyViewed,
    });
  })
  /*
   * DELETE removes a given link from favorites
   * */
  .delete(
    '/favorite/:linkId',
    zValidator('param', z.object({ linkId: z.string().uuid() })),
    zValidator('json', z.object({})),
    async ctx => {
      const params = ctx.req.valid('param');

      await db
        .update(schema.links)
        .set({ isPinned: false })
        .where(eq(schema.links.id, params.linkId));

      return ctx.var.success({
        message: 'Removed from favorites',
        linkId: params.linkId,
      });
    },
  );
export default app;
