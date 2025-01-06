import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from './schema.ts';

const sqlite = new Database('hyperlog.db');

export const db = drizzle({
  casing: 'snake_case',
  client: sqlite,
  schema,
});

/**
 * Checks database connection
 *
 * @throws an `Error` if connection fails
 * */
export async function checkDBConnection() {
  try {
    sqlite.exec('SELECT 1');
  } catch (error) {
    console.error('Database connection failed');
    throw error;
  }
}
