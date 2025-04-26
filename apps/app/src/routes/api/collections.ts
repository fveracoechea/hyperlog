import type { FieldErrors } from 'react-hook-form';
import { data, redirect } from 'react-router';

import { createCollection, getMyCollections } from '@/.server/resources/collection';
import { getSessionOrRedirect } from '@/.server/session';
import { type CreateCollectionFormFields, CreateCollectionSchema } from '@/lib/zod';
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
    data: formData,
    receivedValues: defaultValues,
  } = await getValidatedFormData(request, createResolver);

  if (errors) return { errors, defaultValues };

  const result = await createCollection(user.id, formData);

  if (result.isErr()) {
    // if (result.error === 'COLLECTION_NAME_ALREADY_EXISTS')
    //   return {
    //     defaultValues,
    //     errors: {
    //       name: {
    //         type: 'custom',
    //         message: 'Collection name is already in use. Try a different one.',
    //       },
    //     } satisfies FieldErrors<CreateCollectionFormFields>,
    //   };

    throw data(null);
  }

  const collection = result.value;

  if (collection.parentId) {
    return redirect(`/collections/${collection.parentId}/edit`, { headers });
  } else {
    return redirect(`/collections/${collection.id}`, { headers });
  }
}
