/* eslint-disable no-console */
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';

import { db } from './db.ts';

export default async function runMigrations() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: path.resolve(__dirname, '../drizzle') });
  console.log('Migrations completed');
}
