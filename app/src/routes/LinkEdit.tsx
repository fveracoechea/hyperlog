import { Controller } from 'react-hook-form';
import { Form, Link, data, isRouteErrorResponse, redirect } from 'react-router';

import { getCollections } from '@/.server/resources/collection';
import { getLinkDetails } from '@/.server/resources/link';
import { getTags } from '@/.server/resources/tag';
import { getSessionOrRedirect } from '@/.server/session';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FolderIcon,
  Link2OffIcon,
  LinkIcon,
  PencilOffIcon,
  SaveIcon,
  TypeOutlineIcon,
  Undo2Icon,
  UndoIcon,
} from 'lucide-react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';

import { FormField } from '@/components/FormField';
import { LinkHero } from '@/components/LinkHero';
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

export function ErrorBoundary(props: Route.ErrorBoundaryProps) {
  let headline = 'Oops, an unexpected error occurred';
  let message =
    'We apologize for the inconvenience. Please try again later. If the issue persists, contact support.';

  if (isRouteErrorResponse(props.error) && props.error.status === 404) {
    headline = 'Link Not Found';
    message = 'The requested page could not be found';
  }

  return (
    <section className="mx-auto flex max-w-96 flex-1 items-center pb-10">
      <div className="flex flex-col items-center gap-4">
        <Link2OffIcon className="stroke-cpt-surface1 h-24 w-24" />
        <div className="flex flex-col justify-center gap-0 text-center">
          <Typography variant="large">{headline}</Typography>
          <Typography muted>{message}</Typography>
        </div>
        <Button asChild>
          <Link to="/" replace>
            Go to Homepage
          </Link>
        </Button>
      </div>
    </section>
  );
}

const EditLinkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  tag: z.string().uuid().optional().nullable().default(null),
  collection: z.string().optional().nullable().default(null),
  notes: z.string().optional(),
});

const resolver = zodResolver(EditLinkSchema);
type EditLinkFormFields = z.infer<typeof EditLinkSchema>;

export async function action({ request, params: { linkId } }: Route.LoaderArgs) {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<EditLinkFormFields>(request, resolver);

  console.log(data, errors);

  if (errors) return { errors, defaultValues };

  return null;
}

export async function loader({ request, params: { linkId } }: Route.LoaderArgs) {
  const {
    headers,
    data: { user },
  } = await getSessionOrRedirect(request);

  const link = await getLinkDetails(linkId);
  if (!link) throw data(null, { status: 404 });

  const [tags, collections] = await Promise.all([getTags(user.id), getCollections(user.id)]);

  return data({ link, tags, collections, user }, { headers });
}

export default function LinkEditPage(props: Route.ComponentProps) {
  const {
    loaderData: { link, tags, collections, user },
  } = props;

  const form = useRemixForm({
    resolver,
    defaultValues: {
      title: link.title,
      url: link.url,
      notes: link.notes,
      tag: link.tagId ?? undefined,
      collection: link.collectionId ?? undefined,
    },
  });

  return (
    <div className="mx-auto my-0 flex w-full max-w-[1200px] flex-col gap-2">
      <div>
        <Button asChild variant="ghost" size="sm">
          <Link to={`/links/${link.id}`} replace>
            <UndoIcon /> Go Back
          </Link>
        </Button>
      </div>

      <LinkHero isEditMode link={link} />

      <Form
        method="POST"
        onSubmit={form.handleSubmit}
        className="relative grid grid-cols-2 gap-6 pt-6"
      >
        <FormField
          {...form.register('title')}
          label="Title"
          fieldClassName="col-span-2"
          rightBtn={
            <Button variant="ghost" disabled aria-hidden="true">
              <TypeOutlineIcon className="min-h-5 min-w-5" />
            </Button>
          }
        />
        <FormField
          {...form.register('url')}
          label="URL"
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
            name="tag"
            render={({ field: { value, name, onChange, ...selectProps } }) => (
              <Select value={value} onValueChange={onChange} name={name}>
                <SelectTrigger {...selectProps}>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map(tag => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <Typography>{tag.name}</Typography>
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
            name="collection"
            render={({ field: { value, name, onChange, ...selectProps } }) => (
              <Select value={value} onValueChange={onChange} name={name}>
                <SelectTrigger {...selectProps}>
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
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
                        {collection.ownerId !== user.id && (
                          <Typography variant="small">
                            (shared by {collection.owner.name})
                          </Typography>
                        )}
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
            type="reset"
            onClick={e => {
              e.preventDefault();
              form.reset();
            }}
          >
            <Undo2Icon className="min-h-5 min-w-5" /> <span>Revert Changes</span>
          </Button>
          <Button size="lg" type="submit">
            <SaveIcon className="min-h-5 min-w-5" />
            <span>Save Changes</span>
          </Button>
        </div>
      </Form>
    </div>
  );
}
