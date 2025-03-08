import { data } from 'react-router';

import { getAllCollections } from '@/.server/resources/collection';
import { getSessionOrRedirect } from '@/.server/session';
import { FolderOpenIcon, FoldersIcon } from 'lucide-react';

import { Banner } from '@/components/Banner';
import { CollectionCard } from '@/components/CollectionCard';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';

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
          title="Other Collections"
          subtitle="Shared collections you're a member of"
          Icon={FolderOpenIcon}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
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
