import { Await, data } from 'react-router';

import { getFavorites, getRecentActivity } from '@/.server/resources/link';
import { getSessionOrRedirect } from '@/.server/session';
import { HistoryIcon, Star } from 'lucide-react';
import { promiseHash } from 'remix-utils/promise';

import { Banner } from '@/components/Banner';
import { FavoriteLink } from '@/components/FavoriteLink';
import { LinkCard } from '@/components/LinkCard';

import type { Route } from './+types/Home';

export async function loader({ request }: Route.LoaderArgs) {
  const {
    data: { user },
    headers,
  } = await getSessionOrRedirect(request);

  return data(
    await promiseHash({
      favorites: getFavorites(user.id),
      recentActivityPromise: getRecentActivity(user.id),
    }),
    { headers },
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const favorites = loaderData.favorites;
  return (
    <>
      <section className="flex flex-col gap-4">
        <Banner
          Icon={Star}
          title="Favorites"
          subtitle="Your personal collection of go-to links, saved for quick access"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {favorites.map(link => (
            <FavoriteLink key={link.id} link={link} />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-4 pt-6">
        <Banner
          Icon={HistoryIcon}
          title="Recent Activity"
          subtitle="Revisit your latest discoveries, recently visited links appear here"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          <Await resolve={loaderData.recentActivityPromise}>
            {recents => recents.map(link => <LinkCard key={link.id} link={link} />)}
          </Await>
        </div>
      </section>
    </>
  );
}
