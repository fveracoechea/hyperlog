import { FolderOpenIcon, FoldersIcon } from "lucide-react";
import { jsonHash } from "remix-utils/json-hash";

import { Banner } from "@/components/Banner";
import { CollectionCard } from "@/components/CollectionCard";
import { PageErrorBoundary } from "@/components/PageErrorBoundary";
import { Typography } from "@/components/ui/typography";
import { client } from "@/utility/honoClient.ts";

import type { Route } from "./+types/Collections";

export const ErrorBoundary = PageErrorBoundary;

export function clientLoader({}: Route.LoaderArgs) {
  return jsonHash({
    async parent() {
      const res = await client.api.collection.$get({ query: { type: "parent" } });
      const json = await res.json();
      return json.data.collections;
    },
    async shared() {
      const res = await client.api.collection.$get({ query: { type: "shared" } });
      const json = await res.json();
      return json.data.collections;
    },
  });
}

export default function Collections({ loaderData }: Route.ComponentProps) {
  const { parent } = loaderData;
  return (
    <>
      <section className="flex flex-col gap-4">
        <Banner
          title="My Collections"
          subtitle="Organize links into categorized groups for easy access"
          Icon={FoldersIcon}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {parent.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              linkCount={collection.links.length}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Banner
          title="Shared Collections"
          subtitle="Other collections you're a member of"
          Icon={FolderOpenIcon}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          <div className="border-border flex flex-col gap-2 rounded-md border p-4">
            <Typography muted>Coming Soon!</Typography>
            <Typography variant="small" muted>
              Easily share your bookmark collections with others and collaborate in the app.
            </Typography>
            <Typography variant="small" className="text-right" muted>
              Stay tuned!
            </Typography>
          </div>
        </div>
      </section>
    </>
  );
}
