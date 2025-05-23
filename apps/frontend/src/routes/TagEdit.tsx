import type { Route } from "./+types/TagEdit";
import { data, Form, Link, useSubmit } from "react-router";

import { formatDate } from "date-fns/format";
import {
  CalendarClockIcon,
  FolderPenIcon,
  Link2OffIcon,
  LoaderCircleIcon,
  PencilOffIcon,
  SaveIcon,
  TagIcon,
  TrashIcon,
  Undo2Icon,
} from "lucide-react";

import { Banner } from "@/components/Banner";
import { Button } from "@/components/ui/button.tsx";

import { client } from "@/utility/honoClient";
import { href } from "react-router";
import { useFieldArray, useForm } from "react-hook-form";
import { FormField } from "../components/FormField.tsx";
import { LazyFavicon } from "../components/LazyFavicon.tsx";
import { Typography } from "../components/ui/typography.tsx";
import { AddLinkDialog } from "../components/AddLinkDialog.tsx";
import { LineItem } from "../components/LineItem.tsx";

import { EditTagSchemaType } from "@hyperlog/schemas";
import { redirect } from "react-router";

export async function clientLoader({ params: { tagId } }: Route.ClientLoaderArgs) {
  const response = await client.api.tag[":tagId"].$get({ param: { tagId } });
  const json = await response.json();
  if (!json.success) throw data(null, { status: response.status });
  const { tag: { links, ...tag } } = json.data;
  return {
    tag,
    links: links.map(({ favicon, id, title }) => ({ favicon, title, databaseId: id })),
  };
}

export async function clientAction({ request, params: { tagId } }: Route.ClientActionArgs) {
  const json = await request.json() as EditTagSchemaType;
  const res = await client.api.tag[":tagId"].$put({ param: { tagId }, json });
  const result = await res.json();

  if (result.success) return redirect(href("/tags/:tagId", { tagId }));

  throw data(null, { status: res.status });
}

export default function TagEdit({ loaderData }: Route.ComponentProps) {
  const { tag, links } = loaderData;

  const submit = useSubmit();

  const {
    control,
    register,
    formState: { isDirty, isSubmitting, errors },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: tag.name,
      description: tag.description,
      links,
    },
  });

  const onSubmit = handleSubmit((form) =>
    submit(form, { method: "post", encType: "application/json", replace: true })
  );

  const linksField = useFieldArray({ control, name: "links" });

  return (
    <>
      <div className="flex flex-col gap-4">
        <Banner
          title={tag.name}
          subtitle={tag.description}
          Icon={TagIcon}
        />

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={href("/tags/:tagId", { tagId: tag.id })} replace>
              <PencilOffIcon /> <span>Cancel Edit</span>
            </Link>
          </Button>

          <Button
            form="collection-edit"
            type="reset"
            variant="outline"
            disabled={!isDirty}
            onClick={() => reset()}
          >
            <Undo2Icon className="min-h-5 min-w-5" />
            <span>Revert Changes</span>
          </Button>

          <Button form="tag-edit" type="submit" disabled={!isDirty}>
            {isSubmitting
              ? <LoaderCircleIcon className="min-h-5 min-w-5 animate-spin" />
              : <SaveIcon className="min-h-5 min-w-5" />}
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <Form
        id="tag-edit"
        method="post"
        className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(520px,2fr)_minmax(502px,1fr)] 2xl:gap-6"
        onSubmit={onSubmit}
      >
        <div className="border-border relative flex h-fit flex-col gap-4 rounded-md border p-4 lg:row-span-2">
          <FormField
            label="Name"
            required
            {...register("name")}
            errorMessage={errors.name?.message}
            rightBtn={
              <Button variant="ghost" disabled aria-hidden="true">
                <FolderPenIcon className="min-h-5 min-w-5" />
              </Button>
            }
          />
          <FormField
            variant="textarea"
            label="Description"
            {...register("description")}
            errorMessage={errors.description?.message}
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
                  className="odd:bg-cpt-mantle flex flex-1 items-center gap-2 rounded-md p-2"
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
              <AddLinkDialog
                links={linksField.fields}
                onSelect={(value) => linksField.append(value)}
              />
            </div>
          </div>
        </div>

        <div className="border-border flex h-fit flex-col gap-4 rounded-md border p-4 lg:sticky lg:top-20">
          <LineItem title="Last Saved" Icon={SaveIcon}>
            <Typography className="leading-none">
              {formatDate(tag.updatedAt ?? new Date(), "PPPPp")}
            </Typography>
          </LineItem>

          <LineItem title="Created on" Icon={CalendarClockIcon}>
            <Typography className="leading-none">
              {formatDate(tag.createdAt ?? new Date(), "PPPPp")}
            </Typography>
          </LineItem>
        </div>
      </Form>
    </>
  );
}
