import { data } from 'react-router';

import { api, assertResponse, getSession } from '@/utility/hono';
import clsx from 'clsx';
import { Link, Star, Tag } from 'lucide-react';

import { Banner } from '@/components/Banner';
import { FavoriteLink } from '@/components/FavoriteLink';
import { Typography } from '@/components/ui/typography';

import type { Route } from './+types/Home';

export async function loader({ request }: Route.LoaderArgs) {
  const response = await api.dashboard.home.$get({ json: {} }, getSession(request));
  const json = await assertResponse(response);

  return data(json.data, { headers: request.headers });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const favorites = loaderData.favorites;
  return (
    <>
      <section className="flex flex-col gap-4">
        <Banner title="Favorites" subtitle="Easily access your top picks" Icon={Star} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {favorites.map(link => (
            <FavoriteLink key={link.id} link={link} />
          ))}
        </div>
      </section>
    </>
  );
}
