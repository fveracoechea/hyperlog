import { NavLink } from 'react-router';

import { PopoverClose, PopoverContent } from '@radix-ui/react-popover';
import clsx from 'clsx';
import { PlusIcon, Unlink, UserCircleIcon } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Typography } from '@/components/ui/typography';

import { CreateLinkDialog } from '../CreateLink';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Popover, PopoverTrigger } from '../ui/popover';

export function Header() {
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

      <div className="flex items-center gap-4">
        <CreateLinkDialog
          trigger={
            <Button size="sm">
              <PlusIcon />
              <span>New Link</span>
            </Button>
          }
        />
      </div>
    </header>
  );
}
