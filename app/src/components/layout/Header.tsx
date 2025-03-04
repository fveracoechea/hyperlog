import { NavLink, useLocation } from 'react-router';

import clsx from 'clsx';
import { PaletteIcon, PlusIcon, Unlink, UserCircleIcon } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Typography } from '@/components/ui/typography';

import { CreateLinkDialog } from '../CreateLink';
import { Button } from '../ui/button';

export function Header() {
  const { pathname } = useLocation();
  return (
    <header
      className={clsx(
        'bg-cpt-mantle flex items-center justify-between gap-8 px-6 py-3',
        'border-muted sticky top-0 z-10 border-b border-solid',
      )}
    >
      <div className="flex items-center gap-8">
        <div className="flex gap-2">
          <Unlink className="text-primary" />
          <Typography as="h1" variant="title">
            Hyperlog
          </Typography>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <NavLink to="/">Home</NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <NavLink to="/links">Links</NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <NavLink to="/collections">Collections</NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <NavLink to="/tags">Tags</NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-1">
        <CreateLinkDialog
          key={pathname}
          trigger={
            <Button size="sm" variant="ghost">
              <PlusIcon className="min-h-5 min-w-5" />
              <span>Create New</span>
            </Button>
          }
        />
        <Button variant="ghost" size="sm">
          <PaletteIcon className="min-h-5 min-w-5" />
          <span>Theme</span>
        </Button>
        <Button variant="ghost" size="sm">
          <UserCircleIcon className="min-h-7 min-w-7" />
        </Button>
      </div>
    </header>
  );
}
