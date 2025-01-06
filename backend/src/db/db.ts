import { drizzle } from 'drizzle-orm/libsql/node';

import { env } from '../env.ts';
import * as schema from './schema.ts';

export const db = drizzle({
  casing: 'snake_case',
  schema,
  connection: {
    url: `file:${env.DB_FILENAME}`,
  },
});

/**
 * Checks database connection
 *
 * @throws an `Error` if connection fails
 * */
export async function checkDBConnection() {
  try {
    await db.$client.execute(`SELECT 1`);
  } catch (error) {
    console.error('Database connection failed');
    throw error;
  }
}
