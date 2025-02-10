import { env } from '@/.server/env';
import { drizzle } from 'drizzle-orm/libsql/node';

import * as schema from './schema';

export const db = drizzle({
  casing: 'snake_case',
  schema,
  connection: {
    url: `file:${env.DB_FILENAME}`,
  },
});
