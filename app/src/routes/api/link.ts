import { data, redirect } from 'react-router';

import { env } from '@/.server/env';
import { deleteLink, getLinkDetails } from '@/.server/resources/link';

import type { Route } from './+types/link';

const maxAge = 3600 * 24;

export async function loader({ params: { linkId } }: Route.LoaderArgs) {
  const link = await getLinkDetails(linkId);

  const headers = new Headers();
  if (env.isProd) headers.append('Cache-Control', `private, max-age=${maxAge}`);

  return data(link ?? null, { headers });
}

export async function action({ request, params: { linkId } }: Route.LoaderArgs) {
  const formData = await request.formData();
  const redirectTo = String(formData.get('redirect'));

  if (request.method === 'DELETE') {
    await deleteLink(linkId);
    return redirect(redirectTo);
  }

  return null;
}
