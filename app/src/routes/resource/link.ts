import { redirect } from 'react-router';

import { env } from '@/utils/env';
import { api, assertResponse, getSession } from '@/utils/hono';

import type { Route } from './+types/link';

export async function loader({ request, params: { linkId } }: Route.LoaderArgs) {
  const res = await api.links[':linkId'].$get({ param: { linkId } }, getSession(request));
  const json = await res.json();
  return json.data?.link ?? null;
}

export async function action({ request, params: { linkId } }: Route.LoaderArgs) {
  const formData = await request.formData();
  const redirectTo = String(formData.get('redirect'));

  if (request.method === 'DELETE') {
    const res = await api.links[':linkId'].$delete({ param: { linkId } }, getSession(request));
    await assertResponse(res);
    return redirect(redirectTo);
  }

  return null;
}

export function headers({}: Route.HeadersArgs) {
  const maxAge = 3600 * 24;
  if (env.isProd)
    return {
      'Cache-Control': `private, max-age=${maxAge}`,
    };
  else return {};
}
