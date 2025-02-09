/* eslint-disable no-console */
import 'dotenv/config';

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { StatusCode } from 'hono/utils/http-status';

import { serve } from '@hono/node-server';

import apiRoutes from './api/@routes.ts';
import { jsonResponseMiddleware } from './middlewares/jsonResponse.ts';
import { env } from './utils/env.ts';
import { App } from './utils/types.ts';

const app = new Hono<App>()
  .use(logger())
  .use(secureHeaders())
  .use(csrf())
  .use('*', cors({ origin: env.ALLOWED_ROUTES }))
  .use(jsonResponseMiddleware)
  .route('/api', apiRoutes)
  .get('/healthcheck', async ctx => {
    return ctx.var.success({
      message: `Status OK: ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
    });
  })
  .notFound(ctx => ctx.var.error({ message: 'Resource Not Found.', url: ctx.req.url }, 404))
  .onError((err, ctx) => {
    console.log('-- Server Error --');
    console.log(err);

    let status: StatusCode = 500;
    let message = 'Oops, an unexpected error occurred.';

    if (err instanceof HTTPException) {
      status = err.status;
      message = err.message;
    }

    return ctx.var.error({ message, status }, status);
  });

serve(
  {
    fetch: app.fetch,
    port: env.BACKEND_PORT,
  },
  info => {
    console.log(`Backend server is running on http://${info.address}:${info.port}`);
  },
);

export type HonoApp = typeof app;
