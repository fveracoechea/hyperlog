import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '../db/db.ts';
import { clientQuestions } from '../db/schema.ts';
import { sessionMiddleware } from '../middlewares/session.ts';
import { App } from '../utils/types.ts';

export default new Hono<App>()
  .use(sessionMiddleware)
  /*
   * GET find-one clientQuestion by id
   * */
  .get(
    '/:id',
    zValidator('param', z.object({ id: z.coerce.number().int().nonnegative() })),
    async ctx => {
      const { id } = ctx.req.valid('param');

      const question = await db.query.clientQuestions.findFirst({
        where: eq(clientQuestions.id, id),
        with: {
          defaultQuestion: true,
        },
      });

      if (!question) return ctx.var.error({ message: 'No data found' }, 404);
      return ctx.var.success(question);
    },
  )
  /*
   * GET find-many clientQuestions of a given client-id
   * */
  .get(
    '/client/:id',
    zValidator('param', z.object({ id: z.coerce.number().int().nonnegative() })),
    async ctx => {
      const { id: clientId } = ctx.req.valid('param');

      const questions = await db.query.clientQuestions.findMany({
        where: eq(clientQuestions.clientId, clientId),
        orderBy: asc(clientQuestions.order),
        with: {
          defaultQuestion: true,
        },
      });

      if (questions.length < 1) return ctx.var.error({ message: 'No data found' }, 404);
      return ctx.var.success(questions);
    },
  );
