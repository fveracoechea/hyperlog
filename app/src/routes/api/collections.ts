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

  // await new Promise(r => setTimeout(r, 5000));
  console.log(searchParams);

  const collections = await getMyCollections(user.id, {
    allowSubCollections: searchParams.has('allowSubCollections'),
    noParentCollections: searchParams.has('noParentCollections'),
  });

  return data({ collections }, { headers });
}

const createResolver = zodResolver(CreateCollectionSchema);

export async function action({ request }: Route.ActionArgs) {
  const {
    headers,
    data: { user },
  } = await getSessionOrRedirect(request);

  if (request.method === 'POST') {
    const {
      errors,
      data,
      receivedValues: defaultValues,
    } = await getValidatedFormData(request, createResolver);

    if (errors) return { errors, defaultValues };

    const collection = await createCollection(user.id, data);
    return redirect(`/collections/${collection.id}`, { headers });
  }
}
