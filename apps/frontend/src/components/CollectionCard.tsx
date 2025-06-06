import { href, Link, useNavigation } from "react-router";

import clsx from "clsx";
import { formatDate } from "date-fns";
import { CalendarIcon, LinkIcon } from "lucide-react";

import { Typography } from "@/components/ui/typography";

import type { Route } from "../routes/+types/Collections";
import { CollectionIcon } from "./CollectionIcon";

type CollectionType = Omit<
  Route.ComponentProps["loaderData"]["parent"][number],
  "links" | "users"
>;

export function CollectionCard(props: { collection: CollectionType; linkCount?: number }) {
  const { collection, linkCount } = props;
  const navigation = useNavigation();
  return (
    <Link
      key={collection.id}
      to={href("/collections/:collectionId", { collectionId: collection.id })}
      className={clsx(
        "focus-visible:ring-muted-foreground group rounded-md focus-visible:ring-2",
        navigation.state === "loading" && "cursor-wait opacity-50",
      )}
    >
      <article
        className={clsx(
          "border-border group-hover:border-primary h-full rounded-md border transition-colors",
          "relative flex flex-col gap-2 overflow-hidden p-4",
        )}
      >
        <div className="flex justify-between">
          <CollectionIcon size="medium" color={collection.color ?? undefined} />
          {!!linkCount && linkCount > 0 && (
            <div className="flex items-center gap-2" title="Number of links">
              <LinkIcon className="h-4 w-4" />
              <Typography variant="small">{linkCount}</Typography>
            </div>
          )}
        </div>

        <Typography variant="base" className="group-hover:text-primary">
          {collection.name}
        </Typography>
        <div className="flex w-fit items-center gap-2" title="Last modified">
          <CalendarIcon className="h-4 w-4" />
          <Typography variant="small">
            {formatDate(collection.updatedAt ?? new Date(), "PP")}
          </Typography>
        </div>
      </article>
    </Link>
  );
}
