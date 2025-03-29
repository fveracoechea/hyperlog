import { data, redirect } from 'react-router';

import { createCollection, getMyCollections } from '@/.server/resources/collection';
import { getSessionOrRedirect } from '@/.server/session';
import { CreateCollectionSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getValidatedFormData } from 'remix-hook-form';

import type { Route } from './+types/collections';

export type CollectionApiData = Route.ComponentProps['loaderData'];

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const {
    headers,
    data: { user },
  } = await getSessionOrRedirect(request);

  const collections = await getMyCollections(user.id, {
    onlySubCollections: searchParams.has('onlySubCollections'),
    onlyParentCollections: searchParams.has('onlyParentCollections'),
    search: searchParams.get('search'),
    exclude: searchParams.getAll('exclude') ?? [],
  });

  return data({ collections }, { headers });
}

const createResolver = zodResolver(CreateCollectionSchema);

export async function action({ request }: Route.ActionArgs) {
  const {
    headers,
    data: { user },
  } = await getSessionOrRedirect(request);

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData(request, createResolver);

  if (errors) return { errors, defaultValues };

  const collection = await createCollection(user.id, data);

  if (collection.parentId) {
    return redirect(`/collections/${collection.parentId}/edit`, { headers });
  } else {
    return redirect(`/collections/${collection.id}`, { headers });
  }
}
