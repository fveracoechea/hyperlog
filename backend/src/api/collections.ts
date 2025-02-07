import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { App } from '../utils/types.ts';

const app = new Hono<App>()
  /**
   * POST - Add link to collection
   * */
  .post(
    '/:collectionId/link/:linkId',
    zValidator(
      'param',
      z.object({
        collectionId: z.string().uuid(),
        linkId: z.string().uuid(),
      }),
    ),
    async ctx => {
      const params = ctx.req.valid('param');
    },
  );

export default app;
