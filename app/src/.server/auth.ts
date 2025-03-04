import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';

import { db } from './db';

/**
 * pnpx @better-auth/cli@latest generate --config src/.server/auth.ts --output src/.server/schema/auth-schema.ts
 * */
export const auth = betterAuth({
  plugins: [username()],
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  user: {
    additionalFields: {
      isActive: {
        type: 'boolean',
        required: true,
        defaultValue: true,
      },
    },
  },
});
