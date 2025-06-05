import { data, href, Link, redirect, useSearchParams } from "react-router";

import { CheckIcon, FoldersIcon, LinkIcon, PencilIcon, TrashIcon } from "lucide-react";

import { Banner, SubBanner } from "@/components/Banner";
import { CollectionCard } from "@/components/CollectionCard";
import { CollectionIcon } from "@/components/CollectionIcon";
import { DeleteCollectionDialog } from "@/components/DeleteCollectionDialog";
import { GoBackButton } from "@/components/GoBackButton";
import { LinkCard } from "@/components/LinkCard";
import { PageErrorBoundary } from "@/components/PageErrorBoundary";
import { Button } from "@/components/ui/button";

import type { Route } from "./+types/CollectionPage";
import { client } from "@/utility/honoClient.ts";
import { jsonHash } from "remix-utils/json-hash";
import clsx from "clsx";

export const ErrorBoundary = PageErrorBoundary;

export function clientLoader({ params: { collectionId }, request }: Route.ClientLoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const tag = searchParams.get("tag") ?? undefined;

  return jsonHash({
    tagId: tag,
    async collection() {
      const args = { param: { collectionId }, query: { tag } };
      const res = await client.api.collection[":collectionId"].$get(args);
      const json = await res.json();
      if (!json.success) throw data(json.error.message, { status: res.status });
      return json.data;
    },
    async tags() {
      const args = { param: { collectionId } };
      const res = await client.api.tag.collection[":collectionId"].$get(args);
      const json = await res.json();
      return json.success ? json.data.tags : [];
    },
  });
}

export async function clientAction(
  { request, params: { collectionId } }: Route.ClientActionArgs,
) {
  if (request.method === "DELETE") {
    const deleteLinks = Boolean((await request.formData()).get("delete"));

    const res = await client.api.collection[":collectionId"].$delete({
      param: { collectionId },
      json: { deleteLinks },
    });

    const json = await res.json();
    if (!json.success) throw data(json.error.message, { status: res.status });

    if (json.data.collection.parentId) {
      return redirect(
        href("/collections/:collectionId", { collectionId: json.data.collection.parentId }),
      );
    }

    return redirect(href("/collections"));
  }

  return null;
}

export default function CollectionPage({ loaderData }: Route.ComponentProps) {
  const { collection: { collection, subCollections, links }, tags, tagId } = loaderData;
  const [_, setSearchParams] = useSearchParams();
  return (
    <>
      <div className="flex flex-col gap-4">
        <Banner
          title={collection.name}
          subtitle={collection.description}
          parent={collection.parentCollection?.name}
          iconNode={<CollectionIcon size="large" color={collection.color ?? undefined} />}
        />

        <div className="flex gap-2">
          <GoBackButton />

          <DeleteCollectionDialog
            collection={collection}
            trigger={
              <Button variant="outline" size="sm">
                <TrashIcon />
                <span>Delete Collection</span>
              </Button>
            }
          />

          <Button size="sm" variant="outline" asChild>
            <Link to={`/collections/${collection.id}/edit`} replace>
              <PencilIcon />
              <span>Edit Collection</span>
            </Link>
          </Button>
        </div>
      </div>

      {subCollections.length > 0 && (
        <div className="flex flex-col gap-4">
          <SubBanner title="Sub-Collections" Icon={FoldersIcon} />
          <div className="grid-auto-fill">
            {subCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                linkCount={collection.links.length}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <SubBanner title="Links" Icon={LinkIcon} />

        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => {
              const isActive = tag.id === tagId;
              return (
                <Button
                  key={tag.id}
                  size="sm"
                  variant="outline"
                  className={clsx(isActive && "border-muted-foreground border-2")}
                  onClick={() => {
                    const newParams = new URLSearchParams();
                    if (!isActive) newParams.set("tag", tag.id);
                    setSearchParams(newParams);
                  }}
                >
                  {isActive && <CheckIcon className="stroke-foreground" />}
                  <span>{tag.name}</span>
                </Button>
              );
            })}
          </div>
        )}

        <div className="grid-auto-fill">
          {links.map((link) => (
            <LinkCard key={link.id} link={{ ...link, collection }} noCollection />
          ))}
        </div>
      </div>
    </>
  );
}
