import { Controller, useForm } from "react-hook-form";
import { data, Link, redirect } from "react-router";
import { clsx } from "clsx";
import { jsonHash } from "remix-utils/json-hash";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate, formatDistanceToNow } from "date-fns";
import {
  CalendarClockIcon,
  CircleXIcon,
  EyeIcon,
  LinkIcon,
  LoaderCircleIcon,
  PencilOffIcon,
  SaveIcon,
  TagIcon,
  TypeOutlineIcon,
  Undo2Icon,
} from "lucide-react";

import { EditLinkSchema, EditLinkSchemaType } from "@hyperlog/schemas";
import { client } from "@/utility/honoClient.ts";

import { Banner } from "@/components/Banner";
import { CollectionIcon } from "@/components/CollectionIcon";
import { FormField } from "@/components/FormField";
import { LazyFavicon } from "@/components/LazyFavicon";
import { LineItem } from "@/components/LineItem";
import { PageErrorBoundary } from "@/components/PageErrorBoundary";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";

import { type Route } from "./+types/LinkEdit";
import { href } from "react-router";
import { useSubmit } from "react-router";

export const ErrorBoundary = PageErrorBoundary;

const resolver = zodResolver(EditLinkSchema);

export async function clientAction({ request, params: { linkId } }: Route.ClientActionArgs) {
  const form = await request.json() as EditLinkSchemaType;
  const res = await client.api.link[":linkId"].$put({ param: { linkId }, form });
  const json = await res.json();
  if (!json.success) throw data(json.error.message, { status: res.status });
  // TODO: add snackbar notification
  return redirect(href("/links/:linkId", { linkId }));
}

export function clientLoader({ params: { linkId } }: Route.ClientLoaderArgs) {
  return jsonHash({
    async link() {
      const res = await client.api.link[":linkId"].$get({ param: { linkId } });
      const json = await res.json();
      if (!json.success || !json.data.link) throw data(null, { status: res.status });
      return json.data.link;
    },
    async tags() {
      const response = await client.api.tag.$get();
      const json = await response.json();
      return json.data.tags;
    },
    async collections() {
      const res = await client.api.collection.$get({ query: { type: "owned" } });
      const json = await res.json();
      return json.data.collections;
    },
  });
}

export default function LinkEditPage(props: Route.ComponentProps) {
  const { loaderData: { link, tags, collections } } = props;

  const submit = useSubmit();
  const { control, register, handleSubmit, formState, reset } = useForm({
    resolver,
    defaultValues: {
      title: link.title,
      url: link.url,
      notes: link.notes ?? undefined,
      tagId: link.tagId ?? undefined,
      collectionId: link.collectionId ?? undefined,
    },
  });

  const onSubmit = handleSubmit((form) =>
    submit(form, { method: "post", encType: "application/json", replace: true })
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <Banner
          title={link.title}
          subtitle={link.description}
          iconNode={
            <LazyFavicon
              src={link.favicon ?? undefined}
              width="28px"
              height="28px"
              className="min-h-7 min-w-7"
            />
          }
        />
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/links/${link.id}`} replace>
              <PencilOffIcon /> <span>Cancel Edit</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            type="button"
            disabled={!formState.isDirty || formState.isSubmitting}
            onClick={() => reset()}
          >
            <Undo2Icon className="min-h-5 min-w-5" /> <span>Revert Changes</span>
          </Button>

          <Button type="submit" form="link-edit" disabled={!formState.isDirty}>
            {formState.isSubmitting
              ? <LoaderCircleIcon className="min-h-5 min-w-5 animate-spin" />
              : <SaveIcon className="min-h-5 min-w-5" />}
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <div
        className={clsx(
          "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(520px,2fr)_minmax(400px,1fr)] 2xl:gap-6",
          formState.isSubmitting && "opacity-50 cursor-wait",
        )}
      >
        <form
          id="link-edit"
          method="POST"
          onSubmit={onSubmit}
          className="border-border relative flex h-fit flex-col gap-4 rounded-md border p-4"
        >
          <FormField
            label="Title"
            {...register("title")}
            errorMessage={formState.errors.title?.message}
            rightBtn={
              <Button variant="ghost" disabled aria-hidden="true">
                <TypeOutlineIcon className="min-h-5 min-w-5" />
              </Button>
            }
          />
          <FormField
            label="URL"
            {...register("url")}
            errorMessage={formState.errors.url?.message}
            fieldClassName="col-span-2"
            rightBtn={
              <Button variant="ghost" disabled aria-hidden="true">
                <LinkIcon className="min-h-5 min-w-5" />
              </Button>
            }
          />

          <div className="flex flex-1 flex-col gap-1">
            <Typography as="label" htmlFor="tag-select">
              Collection
            </Typography>
            <Controller
              control={control}
              name="collectionId"
              render={({ field: { value, name, onChange, ...selectProps } }) => (
                <Select
                  key={value}
                  name={name}
                  value={value ?? undefined}
                  onValueChange={(selected) => {
                    if (selected === "NO-COLLECTION") onChange("");
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
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        <div className="flex items-center gap-2">
                          <CollectionIcon size="small" color={collection.color ?? undefined} />
                          <Typography>{collection.name}</Typography>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <Typography as="label" htmlFor="tag-select">
              Tag
            </Typography>
            <Controller
              control={control}
              name="tagId"
              render={({ field: { value, name, onChange, ...selectProps } }) => (
                <Select
                  key={value}
                  name={name}
                  value={value ?? undefined}
                  onValueChange={(selected) => {
                    if (selected === "NO-TAG") onChange("");
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
                    {tags.map((tag) => (
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

          {/* TODO: add rich markdown editor */}
          <FormField
            {...register("notes")}
            label="Notes"
            placeholder="Relevant details or thoughts"
            variant="textarea"
            fieldClassName="col-span-2"
            className="min-h-36 resize-none"
          />
        </form>

        <div className="border-border relative flex h-fit flex-col gap-4 rounded-md border p-4">
          <LineItem title="Last Saved" Icon={SaveIcon}>
            <Typography className="leading-none">
              {formatDate(link.updatedAt ?? new Date(), "PPPp")}
            </Typography>
          </LineItem>

          <LineItem title="Last Visit" Icon={CalendarClockIcon}>
            <Typography className="leading-none">
              {formatDistanceToNow(link.lastVisit ?? new Date(), { addSuffix: true })}
            </Typography>
          </LineItem>

          <LineItem title="Views" Icon={EyeIcon}>
            <Typography className="leading-none">{link.views}</Typography>
          </LineItem>
          <LineItem title="Thumbnail">
            <img
              role="presentation"
              height="630"
              width="1200"
              className="border-border rounded-md border"
              src={link.previewImage ?? undefined}
            />
          </LineItem>
        </div>
      </div>
    </>
  );
}
