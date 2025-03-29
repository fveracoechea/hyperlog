import { data } from 'react-router';

import { getAllCollections } from '@/.server/resources/collection';
import { getSessionOrRedirect } from '@/.server/session';
import { FolderHeartIcon, FolderOpenIcon, FoldersIcon } from 'lucide-react';

import { Banner } from '@/components/Banner';
import { CollectionCard } from '@/components/CollectionCard';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { Typography } from '@/components/ui/typography';

import type { Route } from './+types/Collections';

export const ErrorBoundary = PageErrorBoundary;

export async function loader({ request }: Route.LoaderArgs) {
  const {
    data: { user },
    headers,
  } = await getSessionOrRedirect(request);

  return data(await getAllCollections(user.id), { headers });
}

export default function Collections({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <section className="flex flex-col gap-4">
        <Banner
          title="My Collections"
          subtitle="Organize links into categorized groups for easy access"
          Icon={FoldersIcon}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {loaderData.myCollections.map(collection => (
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
          {loaderData.otherCollections.map(collection => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              linkCount={collection.links.length}
            />
          ))}
        </div>
      </section>
    </>
  );
}
