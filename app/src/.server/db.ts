import { env } from '@/.server/env';
import type { ResultSet } from '@libsql/client';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql/node';
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core';

import * as schema from './schema';

export function isSQLiteErrorCode(err: unknown, code: string) {
  return err instanceof Error && 'code' in err && err.code === code;
}

export type TransactionType = SQLiteTransaction<
  'async',
  ResultSet,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export const db = drizzle({
  casing: 'snake_case',
  schema,
  connection: {
    url: `file:${env.DB_FILENAME}`,
  },
});
