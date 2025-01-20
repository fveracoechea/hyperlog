import { data } from 'react-router';

import { api, assertResponse, getSession } from '@/utility/hono';
import { Star } from 'lucide-react';

import { Banner } from '@/components/Banner';
import { FavoriteLink } from '@/components/FavoriteLink';

import type { Route } from './+types/Home';

async function removeFromFavorites(req: Request, linkId: string) {
  const response = await api.homepage.favorite[':linkId'].$delete(
    { param: { linkId }, json: {} },
    getSession(req),
  );

  await assertResponse(response);

  return response.headers;
}

export async function loader({ request }: Route.LoaderArgs) {
  const response = await api.homepage.loader.$get({ json: {} }, getSession(request));
  const json = await assertResponse(response);
  return data(json.data, { headers: request.headers });
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
        <Banner title="Favorites" subtitle="Easily access your top picks" Icon={Star} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {favorites.map(link => (
            <FavoriteLink key={link.id} link={link} />
          ))}
        </div>
      </section>
    </>
  );
}
