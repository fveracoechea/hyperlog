import { NavLink, useLoaderData } from "react-router";

import clsx from "clsx";
import { TagIcon } from "lucide-react";

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
      <Typography as="h3" variant="base">
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
        "bg-cpt-mantle z-20 flex-col gap-4",
        "sticky top-[62px] h-[calc(100vh-62px)] w-64 p-4 2xl:w-72",
        "border-muted overflow-y-auto border-r border-solid",
      )}
    >
      <SideNav type="collections" links={data.parentCollections ?? []} />
      <SideNav type="tags" links={data.tags ?? []} />
    </aside>
  );
}
