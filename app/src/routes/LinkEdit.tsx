import { Controller } from 'react-hook-form';
import { Form, Link, data, redirect } from 'react-router';

import { getMyCollections } from '@/.server/resources/collection';
import { getLinkDetails, updateLink } from '@/.server/resources/link';
import { getMyTags } from '@/.server/resources/tag';
import { getSessionOrRedirect } from '@/.server/session';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CircleXIcon,
  FolderIcon,
  LinkIcon,
  LoaderCircleIcon,
  PencilOffIcon,
  SaveIcon,
  TagIcon,
  TypeOutlineIcon,
  Undo2Icon,
  UndoIcon,
} from 'lucide-react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';

import { FormField } from '@/components/FormField';
import { LinkHero } from '@/components/LinkHero';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';

import { type Route } from './+types/LinkEdit';

export const ErrorBoundary = PageErrorBoundary;

const EditLinkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  tagId: z.string().uuid().nullable().default(null).catch(null),
  collectionId: z.string().uuid().nullable().default(null).catch(null),
  notes: z.string().optional().nullable().default(null),
});

const resolver = zodResolver(EditLinkSchema);

export async function action({ request, params: { linkId } }: Route.LoaderArgs) {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData(request, resolver);

  if (errors) return { errors, defaultValues };

  await updateLink(linkId, data);
  return redirect(`/links/${linkId}`);
}

export async function loader({ request, params: { linkId } }: Route.LoaderArgs) {
  const {
    headers,
    data: { user },
  } = await getSessionOrRedirect(request);

  const link = await getLinkDetails(linkId);
  if (!link) throw data(null, { status: 404 });

  const [tags, collections] = await Promise.all([
    getMyTags(user.id),
    getMyCollections(user.id, true),
  ]);

  return data({ link, tags, collections, user }, { headers });
}

export default function LinkEditPage(props: Route.ComponentProps) {
  const {
    loaderData: { link, tags, collections, user },
  } = props;

  const form = useRemixForm({
    submitConfig: { replace: true },
    resolver,
    defaultValues: {
      title: link.title,
      url: link.url,
      notes: link.notes,
      tagId: link.tagId ?? undefined,
      collectionId: link.collectionId ?? undefined,
    },
  });

  return (
    <div className="mx-auto my-0 flex w-full max-w-[1200px] flex-col gap-2">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link to={`/links/${link.id}`} replace>
          <UndoIcon /> Go Back
        </Link>
      </Button>

      <LinkHero isEditMode link={link} />

      <Form
        replace
        method="POST"
        onSubmit={form.handleSubmit}
        className="relative grid grid-cols-2 gap-6 pt-6"
      >
        <FormField
          label="Title"
          {...form.register('title')}
          errorMessage={form.formState.errors.title?.message}
          fieldClassName="col-span-2"
          rightBtn={
            <Button variant="ghost" disabled aria-hidden="true">
              <TypeOutlineIcon className="min-h-5 min-w-5" />
            </Button>
          }
        />
        <FormField
          label="URL"
          {...form.register('url')}
          errorMessage={form.formState.errors.url?.message}
          fieldClassName="col-span-2"
          rightBtn={
            <Button variant="ghost" disabled aria-hidden="true">
              <LinkIcon className="min-h-5 min-w-5" />
            </Button>
          }
        />

        <div className="flex flex-col gap-1">
          <Typography as="label" htmlFor="tag-select">
            Tag
          </Typography>
          <Controller
            control={form.control}
            name="tagId"
            render={({ field: { value, name, onChange, ...selectProps } }) => (
              <Select
                key={value}
                name={name}
                value={value ?? undefined}
                onValueChange={selected => {
                  if (selected === 'NO-TAG') onChange('');
                  else onChange(selected);
                }}
              >
                <SelectTrigger {...selectProps}>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {value && (
                    <SelectItem value="NO-TAG">
                      <div className="flex items-center gap-2">
                        <CircleXIcon className="h-5 w-5" />
                        <Typography>No Tag</Typography>
                      </div>
                    </SelectItem>
                  )}
                  {tags.map(tag => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <div className="flex items-center gap-2">
                        <TagIcon className="h-5 w-5" />
                        <Typography>{tag.name}</Typography>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Typography as="label" htmlFor="tag-select">
            Collection
          </Typography>
          <Controller
            control={form.control}
            name="collectionId"
            render={({ field: { value, name, onChange, ...selectProps } }) => (
              <Select
                key={value}
                name={name}
                value={value ?? undefined}
                onValueChange={selected => {
                  if (selected === 'NO-COLLECTION') onChange('');
                  else onChange(selected);
                }}
              >
                <SelectTrigger {...selectProps}>
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {value && (
                    <SelectItem value="NO-COLLECTION">
                      <div className="flex items-center gap-2">
                        <CircleXIcon className="h-5 w-5" />
                        <Typography>No Collection</Typography>
                      </div>
                    </SelectItem>
                  )}
                  {collections.map(collection => (
                    <SelectItem key={collection.id} value={collection.id}>
                      <div className="flex items-center gap-2">
                        <FolderIcon
                          className="h-5 w-5"
                          style={{
                            stroke: collection?.color ?? undefined,
                            fill: collection?.color ?? undefined,
                          }}
                        />
                        <Typography>{collection.name}</Typography>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* TODO: add rich markdown editor */}
        <FormField
          {...form.register('notes')}
          label="Notes"
          placeholder="Relevant details or thoughts"
          variant="textarea"
          fieldClassName="col-span-2"
          className="min-h-36 resize-none"
        />

        <div className="col-span-2 flex justify-end gap-4">
          <Button asChild variant="outline" size="lg">
            <Link to={`/links/${link.id}`} replace>
              <PencilOffIcon /> <span>Cancel Edit</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            type="button"
            disabled={!form.formState.isDirty}
            onClick={() => form.reset()}
          >
            <Undo2Icon className="min-h-5 min-w-5" /> <span>Revert Changes</span>
          </Button>
          <Button size="lg" type="submit" disabled={!form.formState.isDirty}>
            {form.formState.isSubmitting ? (
              <LoaderCircleIcon className="min-h-5 min-w-5 animate-spin" />
            ) : (
              <SaveIcon className="min-h-5 min-w-5" />
            )}
            <span>Save Changes</span>
          </Button>
        </div>
      </Form>
    </div>
  );
}
