import { hc } from "@hono/client";
import type { AppType } from "@hyperlog/backend"; // Your Hono app type

export const client = hc<AppType>("http://localhost:8080/", {
  fetch: ((input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include", // Required for sending cookies cross-origin
    });
  }) satisfies typeof fetch,
});
