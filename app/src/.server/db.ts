import { env } from '@/utils/env.ts';
import { drizzle } from 'drizzle-orm/libsql/node';

import * as schema from './schema';

export const db = drizzle({
  casing: 'snake_case',
  schema,
  connection: {
    url: `file:${env.DB_FILENAME}`,
  },
});
