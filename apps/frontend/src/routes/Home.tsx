import { HistoryIcon, StarIcon } from 'lucide-react';

import { Banner } from '@/components/Banner';
import { LinkCard } from '@/components/LinkCard';

import type { Route } from './+types/Home';
import { jsonHash } from 'remix-utils/json-hash';
import { client } from '@/utility/honoClient.ts';

export function clientLoader({}: Route.ClientLoaderArgs) {
  return jsonHash({
    async favorites() {
      const res = await client.api.link.favorites.$get();
      const json = await res.json();
      return json.data.links;
    },
    async recentActivity() {
      const res = await client.api.link.$get({
        query: { sortBy: 'lastVisit', direction: 'desc', pageSize: '12' },
      });
      const json = await res.json();
      return json.data.links;
    },
  });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const favorites = loaderData.favorites;
  const recents = loaderData.recentActivity;
  return (
    <>
      <section className='flex flex-col gap-4'>
        <Banner
          Icon={StarIcon}
          title='Favorites'
          subtitle='Your personal go-to links, saved for quick access'
        />
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4'>
          {favorites.map((link) => <LinkCard key={link.id} link={link} hideDetails />)}
        </div>
      </section>
      <section className='flex flex-col gap-4'>
        <Banner
          Icon={HistoryIcon}
          title='Recent Activity'
          subtitle='Revisit your latest discoveries, recently visited links appear here'
        />
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4'>
          {recents.map((link) => <LinkCard key={link.id} link={link} />)}
        </div>
      </section>
    </>
  );
}
