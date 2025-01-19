import { Suspense } from 'react';
import { Await, NavLink, useLoaderData } from 'react-router';

import clsx from 'clsx';
import { Folder, Tag } from 'lucide-react';

import { Typography } from '../ui/typography';
import type { Route } from './../../routes/+types/Layout';

export function Sidebar() {
  const loader = useLoaderData<Route.ComponentProps['loaderData']>();
  return (
    <aside
      className={clsx(
        'min-h-[calc(100vh-75px)] h-full w-72 sticky top-[75px]',
        'bg-cpt-mantle py-4 px-6 flex gap-4',
        'border-solid border-r border-muted',
      )}
    >
      <Suspense fallback="Loading layout...">
        <Await resolve={loader.layoutPromise}>
          {data => (
            <div className="flex flex-col gap-4">
              <nav className="flex flex-col gap-2">
                <Typography as="h4" variant="base" muted>
                  Collections
                </Typography>
                <ul className="flex flex-col gap-1">
                  {data.collections?.map(c => (
                    <li
                      key={c.id}
                      className={clsx(
                        'group flex gap-2 items-center hover:bg-cpt-surface0',
                        'rounded transition-colors p-1',
                      )}
                    >
                      <Folder
                        className={clsx(
                          'h-5 w-5 text-muted-foreground transition-colors',
                          'group-hover:text-foreground',
                        )}
                        style={{ fill: c.color ?? undefined }}
                      />
                      <NavLink
                        className="text-sm text-muted-foreground group-hover:text-foreground"
                        to={`/collections/${c.id}`}
                      >
                        {c.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav className="flex flex-col gap-2">
                <Typography as="h4" variant="base" className="text-muted-foreground">
                  Tags
                </Typography>
                <ul className="flex flex-col gap-2">
                  {data.tags?.map(t => (
                    <li key={t.id} className="flex gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <Typography variant="small">{t.name}</Typography>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </Await>
      </Suspense>
    </aside>
  );
}
