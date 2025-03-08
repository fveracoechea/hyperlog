import { Link, data, useNavigation } from 'react-router';

import { getCollections } from '@/.server/resources/collection';
import { getSessionOrRedirect } from '@/.server/session';
import clsx from 'clsx';
import { formatDate } from 'date-fns';
import { CalendarIcon, Library } from 'lucide-react';
import { FolderIcon, LinkIcon } from 'lucide-react';

import { Banner } from '@/components/Banner';
import { Typography } from '@/components/ui/typography';

import type { Route } from './+types/Collections';

export async function loader({ request }: Route.LoaderArgs) {
  const {
    data: { user },
    headers,
  } = await getSessionOrRedirect(request);

  const collections = await getCollections(user.id);

  return data({ collections }, { headers });
}

export default function Collections({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  return (
    <section className="flex flex-col gap-6">
      <Banner
        title="Collections"
        subtitle="Organize links into categorized groups for easy access"
        Icon={Library}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
        {loaderData.collections.map(collection => (
          <Link
            key={collection.id}
            to={`/collections/${collection.id}`}
            className={clsx(
              'focus-visible:ring-muted-foreground group rounded-md focus-visible:ring-2',
              navigation.state === 'loading' && 'cursor-wait opacity-50',
            )}
          >
            <article
              className={clsx(
                'border-border group-hover:border-primary h-full rounded-md border transition-colors',
                'relative flex flex-col gap-2 overflow-hidden p-4',
              )}
            >
              <div className="flex justify-between">
                <FolderIcon
                  className="h-6 w-6"
                  style={{
                    stroke: collection?.color ?? undefined,
                    fill: collection?.color ?? undefined,
                  }}
                />
                <div className="flex items-center gap-2" title="Number of links">
                  <LinkIcon className="h-4 w-4" />
                  <Typography variant="small">{collection.links.length}</Typography>
                </div>
              </div>

              <Typography variant="base" className="group-hover:text-primary">
                {collection.name}
              </Typography>
              <div className="flex w-fit items-center gap-2" title="Last modified">
                <CalendarIcon className="h-4 w-4" />
                <Typography variant="small">
                  {formatDate(collection.updatedAt ?? new Date(), 'PP')}
                </Typography>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
