import { NavLink, useLoaderData } from "react-router";

import clsx from "clsx";
import { SearchIcon, TagIcon } from "lucide-react";

import { CollectionIcon } from "../CollectionIcon";
import type { ColorVariant } from "../ColorPicker";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";
import { LayoutLoaderData } from "@/routes/Layout.tsx";

type SideNavProps = {
  type: "tags" | "collections";
  links: { color?: ColorVariant | null; name: string; id: string }[];
};

function SideNav(props: SideNavProps) {
  const { links, type } = props;
  return (
    <nav className="flex flex-col gap-1">
      <Typography as="h3" variant="small" muted>
        {type === "collections" && "Collections"}
        {type === "tags" && "Tags"}
      </Typography>
      <ul className="flex flex-col gap-0">
        {links.map((link) => (
          <li key={link.id}>
            <Button
              variant="ghost"
              size="sm"
              className="[&.active]:text-primary text-muted-foreground flex flex-1 items-center justify-start gap-2 text-sm 2xl:text-base"
              asChild
            >
              <NavLink to={`/${type}/${link.id}`}>
                {type === "collections" && (
                  <CollectionIcon size="small" color={link.color ?? undefined} />
                )}
                {type === "tags" && (
                  <TagIcon
                    className={clsx(
                      "stroke-muted-foreground h-4 w-4 transition-colors",
                      "group-hover:stroke-foreground group-[.active]:stroke-primary",
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
  const data = useLoaderData<LayoutLoaderData>();
  return (
    <aside
      className={clsx(
        "hidden lg:flex",
        "bg-cpt-mantle z-20 flex-col gap-6",
        "sticky top-[62px] h-[calc(100vh-62px)] w-64 py-6 px-4 2xl:w-72",
        "border-muted overflow-y-auto border-r border-solid",
      )}
    >
      <Button
        variant="outline"
        size="sm"
        className="w-full  max-w-64 items-center justify-start"
      >
        <SearchIcon className="min-h-5 min-w-5 stroke-muted-foreground" />
        <Typography variant="small" muted className="flex-1 text-left leading-normal">
          Search
        </Typography>
        <Typography variant="xsmall" className="bg-cpt-crust rounded-md px-2 py-1">
          ⌘ K
        </Typography>
      </Button>
      <SideNav type="collections" links={data.parentCollections ?? []} />
      <SideNav type="tags" links={data.tags ?? []} />
    </aside>
  );
}
