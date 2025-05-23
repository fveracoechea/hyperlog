import { href, NavLink, useNavigation } from "react-router";

import clsx from "clsx";
import { PlusIcon, UnlinkIcon, UserCircleIcon } from "lucide-react";

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
  const navigation = useNavigation();
  const { pathname } = navigation.location ?? {};

  return (
    <header
      className={clsx(
        "bg-cpt-mantle flex items-center justify-between gap-8 px-6 py-3",
        "border-muted sticky top-0 z-10 border-b border-solid",
      )}
    >
      <div className="flex items-center gap-8 w-full">
        <div className="flex gap-2">
          <UnlinkIcon className="text-primary" />
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

        {/* {navigation.state !== "idle" && ( */}
        {/*   <div className="loader  w-full min-w-[150px] max-w-60" /> */}
        {/* )} */}
      </div>

      <div className="flex w-1/2 items-center justify-end gap-2">
        <CreateNewDialog
          key={pathname}
          trigger={
            <Button variant="ghost" size="sm">
              <PlusIcon className="min-h-5 min-w-5 stroke-primary" />
              <span>Create New</span>
            </Button>
          }
        />
        <ThemeToggle />
        <Button variant="ghost" size="sm" asChild>
          <NavLink to={href("/account")} viewTransition>
            <UserCircleIcon className="stroke-cpt-flamingo min-w-5 min-h-5" />
            <span>Account</span>
          </NavLink>
        </Button>
      </div>
    </header>
  );
}
