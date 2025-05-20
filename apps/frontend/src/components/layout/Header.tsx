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
import { href } from "react-router";

export function Header() {
  const { pathname } = useLocation();
  return (
    <header
      className={clsx(
        "bg-cpt-mantle flex items-center justify-between gap-8 px-6 py-3",
        "border-muted sticky top-0 z-10 border-b border-solid",
      )}
    >
      <div className="flex items-center gap-8 w-full">
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

        <Button
          size="sm"
          variant="outline"
          className="h-[30px] w-full min-w-[150px] max-w-64 items-center justify-start px-2"
        >
          <SearchIcon />
          <Typography variant="small" muted className="flex-1 text-left">
            search
          </Typography>
          <span className="bg-cpt-crust rounded-md px-2">
            <Typography variant="xsmall">⌘ K</Typography>
          </span>
        </Button>
      </div>

      <div className="flex w-1/2 items-center justify-end gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="sm" asChild>
          <NavLink to={href("/account")}>
            <UserCircleIcon className="stroke-cpt-flamingo min-w-5 min-h-5" />
            <span>Account</span>
          </NavLink>
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
