import { NavLink, useLoaderData } from 'react-router';

import clsx from 'clsx';
import { FolderIcon, PlusIcon, TagIcon } from 'lucide-react';

import { Button } from '../ui/button';
import { Typography } from '../ui/typography';
import type { Route } from './../../routes/+types/Layout';

type SideNavProps = {
  type: 'tags' | 'collections';
  links: { color?: string | null; name: string; id: string }[];
};

function SideNav(props: SideNavProps) {
  const { links, type } = props;
  return (
    <nav className="flex flex-col gap-1">
      <Typography as="h3" variant="base">
        {type === 'collections' && 'Collections'}
        {type === 'tags' && 'Tags'}
      </Typography>
      <ul className="flex flex-col gap-0">
        {links.length < 1 && (
          <li>
            <Button
              variant="ghost"
              size="sm"
              className="[&.active]:text-primary w-full justify-start"
            >
              <PlusIcon
                className={clsx(
                  'h-4 min-h-4 w-4 min-w-4',
                  'group-hover:!stroke-foreground group-[.active]:!stroke-foreground',
                )}
              />
              <span className="overflow-hidden overflow-ellipsis whitespace-pre text-inherit">
                New {type === 'tags' ? 'Tag' : 'Collection'}
              </span>
            </Button>
          </li>
        )}
        {links.map(link => (
          <li key={link.id}>
            <Button
              variant="ghost"
              size="sm"
              className="[&.active]:text-primary w-full justify-start text-sm 2xl:text-base"
              asChild
            >
              <NavLink to={`/${type}/${link.id}`}>
                {type === 'collections' && (
                  <FolderIcon
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
                  <TagIcon
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
            </Button>
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
        'hidden lg:block',
        'bg-cpt-mantle z-20 flex-col gap-4',
        'sticky top-[62px] h-[calc(100vh-62px)] w-64 p-4 2xl:w-72',
        'border-muted overflow-y-auto border-r border-solid',
      )}
    >
      <SideNav type="collections" links={data.collections ?? []} />
      <SideNav type="tags" links={data.tags ?? []} />
    </aside>
  );
}
