import { createAuthClient } from 'better-auth/react';
import { adminClient, usernameClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:8080',
  plugins: [usernameClient(), adminClient()],
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

export const useSession = authClient.useSession;
