import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

import { env } from './src/.server/env';

export default defineConfig({
  out: './drizzle',
  schema: './src/.server/schema/index.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: `file:${env.DB_FILENAME}`,
  },
});
