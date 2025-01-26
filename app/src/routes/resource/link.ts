import { type LinkResource, api, getSession } from '@/utility/hono';

import type { Route } from './+types/link';

export async function loader({ request, params: { linkId } }: Route.LoaderArgs) {
  const response = await api.links[':linkId'].$get({ param: { linkId } }, getSession(request));
  const json = await response.json();
  return Response.json(json);
}

export function headers({}: Route.HeadersArgs) {
  return {
    'Cache-Control': 'private, max-age=30',
  };
}

export async function fetchLinkResource(searchParams: URLSearchParams) {
  const linkId = searchParams.get('link');
  if (!linkId) return null;
  const response = await fetch(`/resource/link/${linkId}`);
  return response.json() as Promise<LinkResource>;
}
