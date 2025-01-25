import 'dotenv/config';

import { Hono } from 'hono';
import { rateLimiter } from 'hono-rate-limiter';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { StatusCode } from 'hono/utils/http-status';

import { serve } from '@hono/node-server';

import apiRoutes from './api/@routes.ts';
import { checkDBConnection } from './db/db.ts';
import { env } from './env.ts';
import { jsonResponseMiddleware } from './middlewares/jsonResponse.ts';
import { App } from './utils/types.ts';

const app = new Hono<App>()
  // Log requested api with status
  .use(logger())
  // Security layer for XSS, Clickjackingn etc, Similar to helmet
  .use(secureHeaders())
  // CSRF Protection
  .use(csrf())
  // CORS Middleware
  .use('*', cors({ origin: env.ALLOWED_ROUTES }))
  // Apply the rate limiting middleware to all requests.
  // we can provide custom response
  .use(
    rateLimiter({
      windowMs: 1 * 60 * 1000, // 1 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
      standardHeaders: 'draft-6', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
      keyGenerator: c => c.req.header('cf-connecting-ip') ?? '', // Method to generate custom identifiers for clients.
    }),
  )
  // API
  .use(jsonResponseMiddleware)
  .route('/api', apiRoutes)
  // Healthcheck
  .get('/healthcheck', async ctx => {
    await checkDBConnection();
    return ctx.var.success({
      message: `Status OK: ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
    });
  })
  .notFound(ctx =>
    ctx.var.error(
      {
        message: 'The requested resource was not found.',
        url: ctx.req.url,
      },
      404,
    ),
  )
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
