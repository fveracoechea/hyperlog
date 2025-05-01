import { Hono } from 'hono';

import { AppEnv } from '@/utils/types.ts';

import auth from './auth.ts';
import healthcheck from './healthcheck.ts';
import collection from './collection.ts';
import link from './link.ts';
import tag from './tag.ts';

const app = new Hono<AppEnv>()
  // Public routes
  .route('/auth', auth)
  .route('/healthcheck', healthcheck)
  // Private routes
  .route('/tag', tag)
  .route('/link', link)
  .route('/collection', collection);

export default app;
