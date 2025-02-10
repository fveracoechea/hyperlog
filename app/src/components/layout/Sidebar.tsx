import { NavLink, useLoaderData } from 'react-router';

import clsx from 'clsx';
import { Folder, Tag } from 'lucide-react';

import { Typography } from '../ui/typography';
import type { Route } from './../../routes/+types/Layout';

type SideNavProps = {
  type: 'tags' | 'collections';
  links: { color?: string | null; name: string; id: string }[];
};

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
                'hover:bg-cpt-surface0 group flex items-center gap-1.5',
                'w-full overflow-hidden rounded p-1 transition-colors',
                'text-muted-foreground hover:text-foreground text-sm',
                '[&.active]:bg-primary/20 [&.active]:text-primary',
              )}
              to={`/${type}/${link.id}`}
            >
              {type === 'collections' && (
                <Folder
                  className={clsx(
                    'h-4 min-h-4 w-4 min-w-4',
                    'group-hover:!stroke-foreground group-[.active]:!stroke-foreground',
                  )}
                  style={{
                    stroke: link.color ?? undefined,
                    fill: link.color ?? undefined,
                  }}
                />
              )}
              {type === 'tags' && (
                <Tag
                  className={clsx(
                    'stroke-muted-foreground h-4 w-4 transition-colors',
                    'group-hover:stroke-foreground group-[.active]:stroke-primary',
                  )}
                />
              )}
              <span className="overflow-hidden overflow-ellipsis whitespace-pre text-inherit">
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
  const data = useLoaderData<Route.ComponentProps['loaderData']>();
  return (
    <aside
      className={clsx(
        'sticky top-[68px] h-full min-h-[calc(100vh-68px)] w-64',
        'bg-cpt-mantle z-30 flex gap-4',
        'border-muted border-r border-solid',
      )}
    >
      <div className="flex h-[calc(100vh-75px)] flex-1 flex-col gap-4 overflow-y-auto p-4">
        <SideNav type="collections" links={data.collections ?? []} />
        <SideNav type="tags" links={data.tags ?? []} />
      </div>
    </aside>
  );
}
