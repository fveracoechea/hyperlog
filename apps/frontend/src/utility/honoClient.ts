import { hc } from 'hono/client';
import type { HonoApp } from '@hyperlog/backend';

export const client = hc<HonoApp>('http://localhost:8080/', {
  fetch: (
    (input, init) => {
      return fetch(input, {
        ...init,
        credentials: 'include', // Required for sending cookies cross-origin
      });
    }
  ) satisfies typeof fetch,
});
