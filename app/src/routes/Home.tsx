import { data } from 'react-router';

import { api, assertResponse, getSession } from '@/utility/hono';
import clsx from 'clsx';
import { Link, Star, Tag } from 'lucide-react';

import { Banner } from '@/components/Banner';
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
          {favorites.map(item => {
            return (
              <a
                key={item.id}
                href={item.url}
                rel="noreferrer"
                target="_blank"
                className="block rounded ring-primary hover:ring-1 focus-within:ring-2 min-h-20"
              >
                <article
                  className={clsx(
                    'group border rounded border-border h-full',
                    'relative overflow-hidden transition-shadow',
                  )}
                >
                  {item.previewImage && (
                    <img
                      src={item.previewImage}
                      className="absolute inset-0 h-full w-full z-[1] object-cover"
                    />
                  )}
                  <div
                    className={clsx(
                      'relative z-[2] bg-cpt-base/75',
                      'p-2 flex flex-col gap-2 relative justify-between h-full',
                    )}
                  >
                    <Typography
                      as="h4"
                      variant="small"
                      className="transition-colors group-hover:text-primary"
                    >
                      {item.title}
                    </Typography>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-2 items-center">
                        <Link className="h-3.5 w-3.5 stroke-primary" />
                        <Typography as="span" variant="xsmall" className="no-underline">
                          {item.url}
                        </Typography>
                      </div>
                      {item.tag && (
                        <div className="flex gap-2 items-center">
                          <Tag className="h-3.5 w-3.5 stroke-primary" />
                          <Typography as="span" variant="xsmall" className="no-underline">
                            {item.tag.name}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
