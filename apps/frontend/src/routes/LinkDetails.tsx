import { useRef } from "react";
import { data, Form, Link, redirect, useFetcher, useNavigation } from "react-router";

import { namedAction } from "@hyperlog/helpers";

import { formatDate, formatDistanceToNow } from "date-fns";
import {
  CalendarClockIcon,
  EyeIcon,
  FolderIcon,
  LinkIcon,
  LoaderCircle,
  PencilIcon,
  SaveIcon,
  StarIcon,
  StarOffIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react";

import { Banner } from "@/components/Banner";
import { DeleteLinkDialog } from "@/components/DeleteLinkDialog";
import { GoBackButton } from "@/components/GoBackButton";
import { LazyFavicon } from "@/components/LazyFavicon";
import { PageErrorBoundary } from "@/components/PageErrorBoundary";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

import { type Route } from "./+types/LinkDetails";
import { LineItem } from "../components/LineItem";
import { client } from "@/utility/honoClient.ts";
import { href } from "npm:react-router@^7.5.3";

export const ErrorBoundary = PageErrorBoundary;

export async function clientAction({ request, params: { linkId } }: Route.LoaderArgs) {
  const formData = await request.formData();
  return namedAction(formData, {
    async delete() {
      const res = await client.api.link[":linkId"].$delete({ param: { linkId } });
      const json = await res.json();
      if (!json.success) throw data(null, { status: res.status });
      // TODO: SET global snackbar notification with zustand store or context
      return redirect(href("/links"));
    },
    async favorite() {
      const intent = formData.get("toggle") as "add" | "remove";
      const res = await client.api.link[":linkId"].favorites[":intent"].$put({
        param: { linkId, intent },
      });
      const json = await res.json();
      if (!json.success) throw data(null, { status: res.status });
      return json.data;
    },
  });
}

export async function clientLoader({ params: { linkId } }: Route.LoaderArgs) {
  const res = await client.api.link[":linkId"].$get({ param: { linkId } });
  const link = (await res.json()).data.link;
  if (!link) throw data(null, { status: 404 });
  return { link };
}

export default function LinkDetailsPage({ loaderData: { link } }: Route.ComponentProps) {
  const navigation = useNavigation();

  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement | null>(null);

  const isTogglingFavorite = navigation.state !== "idle" &&
    Boolean(navigation.formData?.has("toggleFavorite"));

  return (
    <>
      <div className="flex flex-col gap-2.5">
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
          <GoBackButton />
          <DeleteLinkDialog
            link={link}
            trigger={
              <Button size="sm" variant="outline">
                <TrashIcon />
                <span>Delete Link</span>
              </Button>
            }
          />
          <Button size="sm" variant="outline" asChild>
            <Link to={`/links/${link.id}/edit`} replace>
              <PencilIcon />
              <span>Edit Link</span>
            </Link>
          </Button>
          <Form method="post">
            <input type="hidden" name="toggle" value={link.isPinned ? "remove" : "add"} />
            <Button
              size="sm"
              variant={link.isPinned ? "secondary" : "default"}
              name="intent"
              value="favorite"
            >
              {isTogglingFavorite && (
                <>
                  <LoaderCircle className="stroke-primary h-4 w-4 animate-spin" />
                  <span>Updating Favories</span>
                </>
              )}

              {!isTogglingFavorite &&
                (link.isPinned
                  ? (
                    <>
                      <StarOffIcon /> Remove from Favorites
                    </>
                  )
                  : (
                    <>
                      <StarIcon /> Add to Favorites
                    </>
                  ))}
            </Button>
          </Form>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(520px,2fr)_minmax(400px,1fr)] 2xl:gap-6">
        <div className="border-border relative flex h-fit flex-col gap-4 rounded-md border p-4">
          <fetcher.Form
            method="PUT"
            action={`/api/link/${link.id}`}
            ref={formRef}
            className="hidden"
          />
          <LineItem
            title="Link"
            Icon={LinkIcon}
            className="col-span-2"
            iconClassName="stroke-primary"
          >
            <Typography
              as="a"
              link
              rel="noreferrer"
              target="_blank"
              href={link.url}
              onClick={() => formRef.current?.requestSubmit()}
            >
              {link.url}
            </Typography>
          </LineItem>

          <LineItem title="Tag" Icon={TagIcon} iconClassName={link.tag && "stroke-primary"}>
            {link.tag
              ? (
                <Typography
                  as="link"
                  className="text-foreground no-underline"
                  to={`/tags/${link.tagId}`}
                >
                  {link.tag?.name}
                </Typography>
              )
              : (
                <Typography muted className="font-light">
                  No tag
                </Typography>
              )}
          </LineItem>

          <LineItem
            title="Collection"
            Icon={FolderIcon}
            iconStyle={{
              stroke: link.collection?.color ?? undefined,
              fill: link.collection?.color ?? undefined,
            }}
          >
            {link.collection
              ? (
                <Typography
                  as="link"
                  className="text-foreground no-underline"
                  to={`/collections/${link.collectionId}`}
                >
                  {link.collection?.name}
                </Typography>
              )
              : (
                <Typography muted className="font-light">
                  No collection
                </Typography>
              )}
          </LineItem>

          {/* TODO: add rich markdown editor */}
          <LineItem title="Notes" className="col-span-2">
            {link.notes
              ? <pre className="whitespace-pre-line font-sans">{link.notes}</pre>
              : (
                <Typography muted className="font-light">
                  No notes yet
                </Typography>
              )}
          </LineItem>
        </div>

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
