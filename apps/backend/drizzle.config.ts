import { defineConfig } from 'drizzle-kit';

import { env } from '@/utils/env.ts';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: `file:${env.DB_FILENAME}`,
  },
});
