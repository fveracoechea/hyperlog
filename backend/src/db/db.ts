import Database from 'better-sqlite3';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { env, isProd } from '../env.ts';
import * as schema from './schema.ts';

const sqlite = new Database('hyperlog.db');

export const db = drizzle({
  casing: 'snake_case',
  schema,
  client: sqlite,
});

/**
 * Checks database connection
 *
 * @throws an `Error` if connection fails
 * */
export async function checkDBConnection() {
  try {
    await db.execute(sql`SELECT 1`);
  } catch (error) {
    console.error('Database connection failed');
    throw error;
  }
}
