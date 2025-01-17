import { data } from 'react-router';

import { type ClientResponse, type InferResponseType, hc } from 'hono/client';
import type { ResponseFormat } from 'hono/types';

import { env } from '@/utility/env';
import type { HonoApp } from '@hyperlog/backend';

const client = hc<HonoApp>(env.VITE_BACKEND_URL);

/**
 * Backend api
 *
 * @example
 * const res = await api.user.$post({ json: { name: 'myUser', email: 'myuser@email.com' } });
 *
 * @example
 * const res = await api.hello.$get();
 */
export const api = client.api;

export function getSession(request: Request) {
  return {
    headers: {
      cookie: request.headers.get('cookie') ?? '',
    },
  };
}

export async function assertResponse<R extends Response>(
  response: R,
): Promise<ReturnType<R['json']>> {
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw data(json.error?.message ?? null, { status: response.status });
  }

  return json;
}

/**
 * @endpoint /api/user/whoami
 * @status 200
 * @method GET
 * */
export type WhoAmIResponse = InferResponseType<(typeof api)['user']['whoami']['$get'], 200>;
