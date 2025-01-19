import { Suspense } from 'react';
import { Await, NavLink, useLoaderData } from 'react-router';

import clsx from 'clsx';
import { Folder, Library, Tag, Tags } from 'lucide-react';

import { Typography } from '../ui/typography';
import type { Route } from './../../routes/+types/Layout';

type SideNavProps = {
  type: 'tags' | 'collections';
  links: { color?: string | null; name: string; id: string }[];
};
function SideNav(props: SideNavProps) {
  const { title, links, type } = props;
  return (
    <nav className="flex flex-col gap-2">
      <Typography as="h4" variant="small" muted className="flex gap-1.5">
        {type === 'collections' && 'Collections'}
        {type === 'tags' && 'Tags'}
      </Typography>
      <ul className="flex flex-col gap-1">
        {links.map(link => (
          <li key={link.id}>
            <NavLink
              className={clsx(
                'group flex gap-1.5 items-center hover:bg-cpt-surface0',
                'rounded transition-colors p-1',
                'text-sm text-muted-foreground hover:text-foreground',
                '[&.active]:bg-primary/20 [&.active]:text-primary',
              )}
              to={`/${type}/${link.id}`}
            >
              {type === 'collections' && (
                <Folder
                  className={clsx(
                    'h-5 w-5 text-muted-foreground transition-colors',
                    'group-hover:text-foreground group-[.active]:text-foreground',
                  )}
                  style={{ fill: link.color ?? undefined }}
                />
              )}
              {type === 'tags' && (
                <Tag
                  className={clsx(
                    'h-4 w-4 stroke-muted-foreground transition-colors',
                    'group-hover:stroke-foreground group-[.active]:stroke-primary',
                  )}
                />
              )}
              <span className="text-inherit">{link.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Sidebar() {
  const loader = useLoaderData<Route.ComponentProps['loaderData']>();
  return (
    <aside
      className={clsx(
        'min-h-[calc(100vh-75px)] h-full w-72 sticky top-[75px]',
        'bg-cpt-mantle flex gap-4',
        'border-solid border-r border-muted',
      )}
    >
      <Suspense fallback="Loading layout...">
        <Await resolve={loader.layoutPromise}>
          {data => (
            <div className="flex flex-col p-4 gap-4 flex-1 h-[calc(100vh-75px)] overflow-y-auto">
              <SideNav type="collections" links={data.collections ?? []} />
              <SideNav type="tags" links={data.tags ?? []} />
            </div>
          )}
        </Await>
      </Suspense>
    </aside>
  );
}
