import { Hono } from 'hono';

import { App } from '../utils/types.ts';
import auth from './auth.ts';
import user from './user.ts';

const app = new Hono<App>({})
  // Public routes
  .route('/auth', auth)
  // INFO: Protected routes, make sure to use `sessionMiddleware`
  .route('/user', user);

export default app;
