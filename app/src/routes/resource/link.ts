import { api, getSession } from '@/utility/hono';

import type { Route } from './+types/link';

export async function loader({ request, params: { linkId } }: Route.LoaderArgs) {
  const res = await api.links[':linkId'].$get({ param: { linkId } }, getSession(request));
  const json = await res.json();
  return json.data?.link ?? null;
}

export function headers({}: Route.HeadersArgs) {
  return {
    'Cache-Control': 'private, max-age=3600',
  };
}
