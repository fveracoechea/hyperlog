import { createAuthClient } from "better-auth/client";
import { username } from "better-auth/plugins";

export const authClient = createAuthClient({
  plugins: [username()],
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
