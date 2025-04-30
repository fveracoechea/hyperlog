import { createAuthClient } from "better-auth/react";
import { usernameClient, adminClient } from "better-auth/client/plugins";

export const { useSession, ...authClient } = createAuthClient({
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
        type: "boolean",
        required: true,
        defaultValue: true,
      },
    },
  },
});
