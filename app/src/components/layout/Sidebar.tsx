import { Suspense } from 'react';
import { Await, NavLink, useLoaderData } from 'react-router';

import clsx from 'clsx';
import { Folder, Tag } from 'lucide-react';

import { Typography } from '../ui/typography';
import type { Route } from './../../routes/+types/Layout';

type SideNavProps = {
  type: 'tags' | 'collections';
  links: { color?: string | null; name: string; id: string }[];
};

function NavFallback({ type }: Pick<SideNavProps, 'type'>) {
  return (
    <nav className="flex flex-col gap-2">
      <Typography as="h4" variant="small" muted className="flex gap-1.5">
        {type === 'collections' && 'Collections'}
        {type === 'tags' && 'Tags'}
      </Typography>
      <ul className="animate-pulse flex flex-col gap-3">
        <li className="h-5 w-2/3 bg-muted rounded cursor-wait" />
        <li className="h-5 w-3/4 bg-muted rounded cursor-wait" />
        <li className="h-5 w-1/2 bg-muted rounded cursor-wait" />
        <li className="h-5 w-2/3 bg-muted rounded cursor-wait" />
        <li className="h-5 w-3/4 bg-muted rounded cursor-wait" />
      </ul>
    </nav>
  );
}

function SideNav(props: SideNavProps) {
  const { links, type } = props;
  return (
    <nav className="flex flex-col gap-2">
      <Typography as="h3" variant="small" muted className="flex gap-1.5">
        {type === 'collections' && 'Collections'}
        {type === 'tags' && 'Tags'}
      </Typography>
      <ul className="flex flex-col gap-1">
        {links.map(link => (
          <li key={link.id}>
            <NavLink
              className={clsx(
                'group flex gap-1.5 items-center hover:bg-cpt-surface0',
                'rounded transition-colors p-1 overflow-hidden w-full',
                'text-sm text-muted-foreground hover:text-foreground',
                '[&.active]:bg-primary/20 [&.active]:text-primary',
              )}
              to={`/${type}/${link.id}`}
            >
              {type === 'collections' && (
                <Folder
                  className={clsx(
                    'w-4 h-4 min-w-4 min-h-4',
                    'group-hover:!stroke-foreground group-[.active]:!stroke-primary',
                  )}
                  style={{ stroke: link.color ?? undefined }}
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
              <span className="whitespace-pre overflow-hidden text-inherit overflow-ellipsis">
                {link.name}
              </span>
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
        'min-h-[calc(100vh-75px)] h-full w-64 sticky top-[75px]',
        'bg-cpt-mantle flex gap-4 z-30',
        'border-solid border-r border-muted',
      )}
    >
      <Suspense
        fallback={
          <div className="flex flex-col p-4 gap-4 flex-1 h-[calc(100vh-75px)] overflow-y-auto">
            <NavFallback type="collections" />
            <NavFallback type="tags" />
          </div>
        }
      >
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
