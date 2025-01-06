import { migrate } from 'drizzle-orm/sqlite-core';
import path from 'path';

import { db } from './db.ts';

export default async function runMigrations() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: path.resolve(__dirname, '../drizzle') });
  console.log('Migrations completed');
}
