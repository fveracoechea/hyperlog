import { drizzle } from 'drizzle-orm/libsql/node';

import * as schema from './schema.ts';

export * as schema from './schema.ts';

export const db = drizzle({
  casing: 'snake_case',
  schema,
  connection: {
    url: `file:../hyperlog.db`,
  },
});
