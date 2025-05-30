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
      <div className="flex w-full items-center gap-8">
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
                <NavLink to={href("/")}>Home</NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <NavLink to={href("/links")}>Links</NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <NavLink to={href("/collections")}>Collections</NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <NavLink to={href("/tags")}>Tags</NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex w-1/2 items-center justify-end gap-2">
        <CreateNewDialog
          key={pathname}
          trigger={
            <Button variant="ghost" size="sm" id="create-new-button">
              <PlusIcon className="min-h-5 min-w-5 stroke-primary" />
              <span>Create New</span>
            </Button>
          }
        />
        <ThemeToggle />
        <Button variant="ghost" size="sm" asChild>
          <NavLink to={href("/settings/account")} viewTransition>
            <UserCircleIcon className="min-h-5 min-w-5 stroke-cpt-flamingo" />
            <span>Account</span>
          </NavLink>
        </Button>
      </div>
    </header>
  );
}
