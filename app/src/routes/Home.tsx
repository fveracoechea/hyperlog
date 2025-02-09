import { Await, data } from 'react-router';

import { api, assertResponse, getSession } from '@/utils/hono';
import { HistoryIcon, Star } from 'lucide-react';

import { Banner } from '@/components/Banner';
import { FavoriteLink } from '@/components/FavoriteLink';
import { LinkCard } from '@/components/LinkCard';

import type { Route } from './+types/Home';

async function removeFromFavorites(req: Request, linkId: string) {
  const response = await api.links.favorite[':linkId'].$delete(
    { param: { linkId }, json: {} },
    getSession(req),
  );
  await assertResponse(response);
  return response.headers;
}

async function getRecentActivity(req: Request) {
  const response = await api.links.recents.$get({ json: {} }, getSession(req));
  const json = await assertResponse(response);
  return json.data.recentlyViewed;
}

export async function loader({ request }: Route.LoaderArgs) {
  const response = await api.links.favorites.$get({ json: {} }, getSession(request));
  const json = await assertResponse(response);

  return data(
    {
      favorites: json.data.favorites,
      recentActivityPromise: getRecentActivity(request),
    },
    { headers: request.headers },
  );
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  let headers = new Headers();

  if (intent === 'remove-favorite')
    headers = await removeFromFavorites(request, String(formData.get('linkId')));

  return data(null, { headers });
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
