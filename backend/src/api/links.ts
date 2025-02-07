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
  /**
   * PUT - Add link to collection
   * */
  .put(
    '/:linkId/collection/:collectionId',
    zValidator(
      'param',
      z.object({
        collectionId: z.string().uuid(),
        linkId: z.string().uuid(),
      }),
    ),
    async ctx => {
      const params = ctx.req.valid('param');

      await db
        .update(schema.links)
        .set({ collectionId: params.collectionId })
        .where(eq(schema.links.id, params.linkId));

      return ctx.var.success({
        message: 'Link added to collection',
        collectionId: params.collectionId,
        linkId: params.linkId,
      });
    },
  )
  /*
   * DELETE removes a given link from favorites
   * */
  .delete(
    '/favorite/:linkId',
    zValidator('param', z.object({ linkId: z.string().uuid() })),
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
  )
  /*
   * DELETE a given link
   * */
  .delete(
    '/:linkId',
    zValidator('param', z.object({ linkId: z.string().uuid() })),
    async ctx => {
      const params = ctx.req.valid('param');

      await db.delete(schema.links).where(eq(schema.links.id, params.linkId));

      return ctx.var.success({
        message: 'Link has been deleted',
        linkId: params.linkId,
      });
    },
  )
  /*
   * GET link details (find-one)
   * */
  .get('/:linkId', zValidator('param', z.object({ linkId: z.string().uuid() })), async ctx => {
    const params = ctx.req.valid('param');

    const link = await db.query.links.findFirst({
      where: and(eq(schema.links.id, params.linkId)),
      with: {
        tag: true,
        collection: true,
      },
    });

    if (!link) return ctx.var.error({ message: 'Link Not Found' }, 404);

    return ctx.var.success({ link });
  });

export default app;
