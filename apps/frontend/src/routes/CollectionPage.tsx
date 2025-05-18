import { data, Link, redirect } from "react-router";

import { FoldersIcon, LinkIcon, PencilIcon, TrashIcon } from "lucide-react";

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

export const ErrorBoundary = PageErrorBoundary;

export async function clientLoader({ params: { collectionId } }: Route.ClientLoaderArgs) {
  const res = await client.api.collection[":collectionId"].$get({ param: { collectionId } });
  const json = await res.json();
  if (!json.success) throw data(json.error.message, { status: res.status });
  return json.data;
}

export async function clientAction(
  { request, params: { collectionId } }: Route.ClientActionArgs,
) {
  if (request.method === "DELETE") {
    const res = await client.api.collection[":collectionId"].$delete({
      param: { collectionId },
    });

    const json = await res.json();
    if (!json.success) throw data(json.error.message, { status: res.status });

    if (json.data.collection.parentId) {
      return redirect(`/collections/${json.data.collection.parentId}`);
    }

    return redirect("/collections");
  }

  return null;
}

export default function CollectionPage({
  loaderData: { collection, subCollections, links },
}: Route.ComponentProps) {
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {links.map((link) => <LinkCard key={link.id} link={link} />)}
        </div>
      </div>
    </>
  );
}
