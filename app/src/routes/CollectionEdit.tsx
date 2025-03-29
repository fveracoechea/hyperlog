import { Controller, useFieldArray } from 'react-hook-form';
import { Form, Link, data, redirect } from 'react-router';

import {
  deleteCollection,
  editCollection,
  getCollectionDetails,
} from '@/.server/resources/collection';
import { getSessionOrRedirect } from '@/.server/session';
import { type EditCollectionFormFields, EditCollectionSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FolderIcon,
  FolderPenIcon,
  FolderXIcon,
  Link2OffIcon,
  LoaderCircleIcon,
  PencilOffIcon,
  SaveIcon,
  TrashIcon,
  Undo2Icon,
} from 'lucide-react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';

import { AddLinkToCollectionDialog } from '@/components/AddLinkToCollectionDialog';
import { AddSubCollectionDialog } from '@/components/AddSubCollectionDialog';
import { Banner } from '@/components/Banner';
import { ColorPicker } from '@/components/ColorPicker';
import { FormField } from '@/components/FormField';
import { LazyFavicon } from '@/components/LazyFavicon';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import type { Route } from './+types/CollectionEdit';

export const ErrorBoundary = PageErrorBoundary;

const resolver = zodResolver(EditCollectionSchema);

export async function loader({ params: { collectionId }, request }: Route.LoaderArgs) {
  const {
    headers,
    data: { user },
  } = await getSessionOrRedirect(request);

  const results = await getCollectionDetails(user.id, collectionId);
  const links = results.links.map(({ tag: _, ...link }) => ({ ...link, databaseId: link.id }));
  const subCollections = results.subCollections.map(
    ({ links: _l, owner: _o, id, ...data }) => ({
      id,
      databaseId: id,
      ...data,
    }),
  );

  return data(
    {
      collection: results.collection,
      subCollections,
      links,
    },
    { headers },
  );
}

export type SubCollectionItem = EditCollectionFormFields['subCollections'][number];
export type LinkItem = EditCollectionFormFields['links'][number];

export async function action({ request, params: { collectionId } }: Route.ActionArgs) {
  const {
    headers,
    data: { user },
  } = await getSessionOrRedirect(request);

  if (request.method === 'PUT') {
    const {
      errors,
      data: formData,
      receivedValues: defaultValues,
    } = await getValidatedFormData(request, resolver);
    if (errors) return data({ errors, defaultValues }, { headers });
    await editCollection(user.id, collectionId, formData);
    return redirect(`/collections/${collectionId}`, { headers });
  }

  if (request.method === 'DELETE') {
    await deleteCollection(user.id, collectionId);
    return redirect(`/collections`, { headers });
  }
}

export default function CollectionPage(props: Route.ComponentProps) {
  const {
    loaderData: { collection, subCollections, links },
  } = props;

  const { control, register, formState, handleSubmit, reset } = useRemixForm({
    resolver,
    defaultValues: {
      name: collection.name,
      description: collection.description,
      color: collection.color,
      subCollections,
      links,
    },
  });

  const linksField = useFieldArray({ control, name: 'links' });
  const subCollectionsField = useFieldArray({ control, name: 'subCollections' });

  return (
    <>
      <div className="flex flex-col gap-4">
        <Banner
          title={collection.name}
          subtitle={collection.description}
          iconNode={
            <FolderIcon
              className="h-7 w-7"
              style={{
                stroke: collection?.color ?? undefined,
                fill: collection?.color ?? undefined,
              }}
            />
          }
        />

        <div className="flex gap-4">
          <Button asChild variant="destructive">
            <Link to={`/collections/${collection.id}`} replace>
              <PencilOffIcon /> <span>Cancel Edit</span>
            </Link>
          </Button>

          <Button
            form="collection-edit"
            type="reset"
            variant="outline"
            disabled={!formState.isDirty}
            onClick={() => reset()}
          >
            <Undo2Icon className="min-h-5 min-w-5" />
            <span>Revert Changes</span>
          </Button>

          <Button form="collection-edit" type="submit" disabled={!formState.isDirty}>
            {formState.isSubmitting ? (
              <LoaderCircleIcon className="min-h-5 min-w-5 animate-spin" />
            ) : (
              <SaveIcon className="min-h-5 min-w-5" />
            )}
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <Form
        id="collection-edit"
        className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(520px,2fr)_minmax(502px,1fr)] 2xl:gap-6"
        method="PUT"
        onSubmit={handleSubmit}
      >
        <div className="border-border relative flex h-fit flex-col gap-4 rounded-md border p-4 lg:row-span-2">
          <FormField
            label="Name"
            required
            {...register('name')}
            errorMessage={formState.errors.name?.message}
            rightBtn={
              <Button variant="ghost" disabled aria-hidden="true">
                <FolderPenIcon className="min-h-5 min-w-5" />
              </Button>
            }
          />
          <FormField
            variant="textarea"
            label="Description"
            {...register('description')}
            errorMessage={formState.errors.description?.message}
          />

          <div className="flex flex-col gap-1">
            <Typography>Links</Typography>
            <ul className="flex w-full flex-col gap-1">
              {linksField.fields.length < 1 && (
                <li className="flex items-center gap-2 px-4 py-2">
                  <Link2OffIcon className="stroke-cpt-overlay0" />
                  <Typography variant="small" muted>
                    No links available.
                  </Typography>
                </li>
              )}
              {linksField.fields.map((link, index) => (
                <li
                  key={link.id}
                  className="even:bg-cpt-mantle flex flex-1 items-center gap-2 rounded-md p-2"
                >
                  <LazyFavicon width="26px" height="26px" src={link.favicon ?? undefined} />
                  <Typography
                    variant="base"
                    as="span"
                    className="flex-1 overflow-x-hidden overflow-ellipsis whitespace-nowrap"
                  >
                    {link.title}
                  </Typography>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7"
                    type="button"
                    onClick={() => linksField.remove(index)}
                  >
                    <TrashIcon className="h-5 w-5" />
                    <Typography variant="small">Remove</Typography>
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end pt-4">
              <AddLinkToCollectionDialog
                links={linksField.fields}
                onSelect={value => linksField.append(value)}
              />
            </div>
          </div>
        </div>

        <div className="border-border flex h-fit flex-col gap-4 rounded-md border p-4 lg:sticky lg:top-20">
          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <ColorPicker value={field.value} onColorChange={field.onChange} />
            )}
          />

          <div className="flex flex-col gap-1">
            <Typography>Sub-Collections</Typography>
            <ul className="flex flex-col gap-1">
              {subCollectionsField.fields.length < 1 && (
                <li className="flex items-center gap-2 px-4 py-2">
                  <FolderXIcon className="stroke-cpt-overlay0" />
                  <Typography variant="small" muted>
                    No sub-collections available.
                  </Typography>
                </li>
              )}
              {subCollectionsField.fields.map((subCollection, index) => (
                <li
                  key={subCollection.id}
                  className="even:bg-cpt-mantle flex flex-1 items-center gap-2 rounded-md p-2"
                >
                  <FolderIcon
                    className="h-5 min-h-5 w-5 min-w-5"
                    style={{
                      stroke: subCollection?.color ?? undefined,
                      fill: subCollection?.color ?? undefined,
                    }}
                  />
                  <Typography
                    variant="base"
                    as="span"
                    className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap"
                  >
                    {subCollection.name}
                  </Typography>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7"
                    type="button"
                    onClick={() => subCollectionsField.remove(index)}
                  >
                    <TrashIcon className="h-5 w-5" />
                    <Typography variant="small">Remove</Typography>
                  </Button>
                </li>
              ))}
            </ul>

            <div className="flex justify-end pt-4">
              <AddSubCollectionDialog />
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}
