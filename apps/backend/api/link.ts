import { Hono } from 'hono';
import { z } from 'zod';
import { and, desc, eq, notInArray, sql } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';

import { db, schema } from '@/db/db.ts';
import { AppEnv } from '@/utils/types.ts';
import { sessionMiddleware } from '@/middlewares/session.ts';
import { paginationHelper } from '@/utils/pagination.ts';

import { CreateLinkSchema, EditLinkSchema, PaginationSchema } from '@hyperlog/schemas';
import { fetchLinkData, validateLinkAccess } from '@/utils/links.ts';

const app = new Hono<AppEnv>()
  .use(sessionMiddleware)
  /**
   * List all Favories
   */
  .get('/favorites', async (c) => {
    const links = await db.query.link.findMany({
      orderBy: desc(schema.link.views),
      with: { collection: true },
      where: and(eq(schema.link.ownerId, c.var.user.id), eq(schema.link.isPinned, true)),
    });
    return c.var.success({ links });
  })
  /**
   * Edit Favorites status of a given link
   */
  .put(
    '/:linkId/favorites/:intent',
    zValidator(
      'param',
      z.object({ linkId: z.string().uuid(), intent: z.enum(['add', 'remove']) }),
    ),
    async (c) => {
      const { linkId, intent } = c.req.valid('param');
      await db
        .update(schema.link)
        .set({ isPinned: intent === 'add' })
        .where(eq(schema.link.id, linkId));
      return c.var.success({ message: 'success' });
    },
  )
  /**
   * Create Link
   */
  .post('/', zValidator('form', CreateLinkSchema), async (c) => {
    const formData = c.req.valid('form');
    const linkData = await fetchLinkData(formData.url);
    const title = formData.title || linkData.title;

    if (!title) {
      return c.var.error(
        {
          field: 'title',
          type: 'required',
          message: 'No page Title found. Please provide one.',
        },
        400,
      );
    }

    const [link] = await db
      .insert(schema.link)
      .values({ ...formData, ...linkData, title, ownerId: c.var.user.id })
      .returning();

    return c.var.success({ link });
  })
  /**
   * Delete link
   */
  .delete(
    '/:linkId',
    zValidator('param', z.object({ linkId: z.string().uuid() })),
    async (c) => {
      const { linkId } = c.req.valid('param');
      const [message, status] = await validateLinkAccess(linkId, c.var.user.id);
      if (message) return c.var.error({ message }, status);

      await db.delete(schema.link).where(eq(schema.link.id, linkId));
      return c.var.success({ message: 'Link deleted successfully.' });
    },
  )
  /**
   * Track Visit and Increase view count
   */
  .put(
    '/:linkId/visited',
    zValidator('param', z.object({ linkId: z.string().uuid() })),
    async (c) => {
      const { linkId } = c.req.valid('param');
      await db
        .update(schema.link)
        .set({ views: sql`${schema.link.views} + 1`, lastVisit: sql`(unixepoch())` })
        .where(eq(schema.link.id, linkId));
      return c.var.success({ message: 'success' });
    },
  )
  /**
   * Edit link
   */
  .put(
    '/:linkId',
    zValidator('param', z.object({ linkId: z.string().uuid() })),
    zValidator('form', EditLinkSchema),
    async (c) => {
      const { linkId } = c.req.valid('param');
      const formData = c.req.valid('form');

      const [message, status] = await validateLinkAccess(linkId, c.var.user.id);
      if (message) return c.var.error({ message }, status);

      const [link] = await db
        .update(schema.link)
        .set(formData)
        .where(eq(schema.link.id, linkId))
        .returning();

      return c.var.success({ message: 'success', link });
    },
  )
  /**
   * Get Link Details
   */
  .get('/:linkId', zValidator('param', z.object({ linkId: z.string().uuid() })), async (c) => {
    const { linkId } = c.req.valid('param');
    const link = await db.query.link.findFirst({
      where: and(eq(schema.link.id, linkId)),
      with: {
        tag: true,
        collection: true,
      },
    });

    if (!link) c.var.error({ message: 'Not found' }, 404);
    return c.var.success({ link });
  })
  /**
   * Get paginated links
   */
  .get('/', zValidator('query', PaginationSchema), async (c) => {
    const searchParams = c.req.valid('query');

    const where = [eq(schema.link.ownerId, c.var.user.id)];
    if (searchParams.exclude) where.push(notInArray(schema.link.id, searchParams.exclude));

    const args = paginationHelper({
      table: 'link',
      searchableFields: ['title', 'url'],
      searchParams,
      where,
    });

    const results = await db.query.link.findMany({
      ...args,
      with: {
        tag: true,
        collection: true,
      },
    });

    return c.var.success({
      totalRecords: Number(results.at(0)?.totalRecords ?? 0),
      links: results.map(({ totalRecords: _, ...data }) => data),
    });
  });
export default app;
