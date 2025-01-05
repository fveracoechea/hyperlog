import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { env, isProd } from '../env.ts';
import * as schema from './schema.ts';

/** It create pool of postgres connections, Which improves performance */
const pool = new pg.Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: isProd,
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
});

export const db = drizzle({ client: pool, casing: 'snake_case', schema });

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
