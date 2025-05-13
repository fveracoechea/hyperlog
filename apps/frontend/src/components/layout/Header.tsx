import { NavLink, useLocation } from "react-router";

import clsx from "clsx";
import { PlusIcon, SearchIcon, Unlink, UserCircleIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Typography } from "@/components/ui/typography";

import { CreateNewDialog } from "../CreateNew";
import { Button } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { pathname } = useLocation();
  return (
    <header
      className={clsx(
        "bg-cpt-mantle flex items-center justify-between gap-8 px-6 py-3",
        "border-muted sticky top-0 z-10 border-b border-solid",
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

      <div className="flex w-1/2 items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-[30px] w-full min-w-[150px] max-w-64 items-center justify-start px-2"
        >
          <SearchIcon />
          <Typography variant="small" muted className="flex-1 text-left">
            Search
          </Typography>
          <span className="bg-cpt-crust rounded-md px-2">
            <Typography variant="xsmall">⌘ K</Typography>
          </span>
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="sm">
          <UserCircleIcon className="stroke-cpt-flamingo min-h-5 min-w-5" />
          <span>My Account</span>
        </Button>
        <CreateNewDialog
          key={pathname}
          trigger={
            <Button size="sm">
              <PlusIcon className="min-h-5 min-w-5" />
              <span>Create New</span>
            </Button>
          }
        />
      </div>
    </header>
  );
}
