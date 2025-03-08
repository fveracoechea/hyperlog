import { data } from 'react-router';

import { getCollectionDetails } from '@/.server/resources/collection';
import { getSessionOrRedirect } from '@/.server/session';
import { FolderIcon, FoldersIcon, LinkIcon } from 'lucide-react';

import { Banner, SubBanner } from '@/components/Banner';
import { CollectionCard } from '@/components/CollectionCard';
import { GoBackButton } from '@/components/GoBackButton';
import { LinkCard } from '@/components/LinkCard';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';

import type { Route } from './+types/CollectionPage';

export const ErrorBoundary = PageErrorBoundary;

export async function loader({ params: { collectionId }, request }: Route.LoaderArgs) {
  const {
    headers,
    data: { user },
  } = await getSessionOrRedirect(request);

  return data(await getCollectionDetails(user.id, collectionId), { headers });
}

export default function CollectionPage({
  loaderData: { collection, subCollections, links },
}: Route.ComponentProps) {
  return (
    <>
      <Banner
        title={collection.name}
        subtitle={collection.description}
        iconNode={
          <FolderIcon
            className="h-7 w-7"
            style={{
              stroke: collection?.color ?? undefined,
              fill: collection?.color ?? undefined,
            }}
          />
        }
      />

      {subCollections.length > 0 && (
        <div className="flex flex-col gap-4">
          <SubBanner title="Sub-Collections" Icon={FoldersIcon} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
            {subCollections.map(collection => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <SubBanner title="Links" Icon={LinkIcon} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {links.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      </div>
    </>
  );
}
