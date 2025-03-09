import { data } from 'react-router';

import { getMyCollections } from '@/.server/resources/collection';
import { getSessionOrRedirect } from '@/.server/session';

import type { Route } from './+types/collections';

export type CollectionApiData = Route.ComponentProps['loaderData'];

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const {
    headers,
    data: { user },
  } = await getSessionOrRedirect(request);

  const collections = await getMyCollections(user.id, searchParams.has('allowSubCollections'));

  return data({ collections }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  return null;
}
