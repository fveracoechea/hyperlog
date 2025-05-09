import { useNavigate } from "react-router";

import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { CalendarClockIcon, LinkIcon } from "lucide-react";

import type { Route } from "../routes/+types/Home";
import { CollectionIcon } from "./CollectionIcon";
import { LazyFavicon } from "./LazyFavicon";
import { Button } from "./ui/button";
import { Typography } from "./ui/typography";
import { trackLinkActivity } from "../utility/link.ts";

type LinkData = Route.ComponentProps["loaderData"]["recentActivity"][number];
type LinkType =
  & Omit<LinkData, "tag" | "collection">
  & Partial<Pick<LinkData, "tag" | "collection">>;

type Props = {
  isLoading?: boolean;
  link: LinkType;
};

export function LinkCard({ link, isLoading }: Props) {
  const navigate = useNavigate();
  return (
    <a
      href={link.url}
      title={link.notes ?? ""}
      rel="noreferrer"
      target="_blank"
      onClick={async () => await trackLinkActivity(link.id)}
      className={clsx(
        "focus-visible:ring-muted-foreground group block rounded-md focus-visible:ring-2",
        isLoading && "cursor-wait opacity-50",
      )}
    >
      <article
        className={clsx(
          "border-border group-hover:border-primary h-full rounded-md border transition-colors",
          "relative flex flex-col overflow-hidden",
        )}
      >
        {link.previewImage && (
          <img
            role="presentation"
            loading="lazy"
            className={clsx(
              "absolute top-0 left-0 right-0 object-cover object-center blur-[1px]",
            )}
            src={link.previewImage}
          />
        )}
        <div
          className={clsx(
            "relative flex flex-1 flex-col justify-between gap-4 rounded-md p-2 aspect-[1.9/1]",
            "bg-gradient-to-b from-cpt-base/65  to-cpt-base via-0% to-65%",
          )}
        >
          <div className="flex items-start justify-between">
            <LazyFavicon src={link.favicon ?? undefined} width="26px" height="26px" />

            <div className="flex items-center gap-1.5" title="Last visit">
              <CalendarClockIcon className="stroke-muted-foreground  w-5 h-5" />
              <Typography as="span" variant="small" className="whitespace-nowrap">
                {formatDistanceToNow(link.lastVisit ?? Date.now(), {
                  addSuffix: true,
                })}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-2">
            <Typography
              as="h4"
              className={clsx(
                "group-hover:text-primary overflow-y-hidden text-left leading-tight",
                "max-h-5 overflow-x-hidden overflow-ellipsis whitespace-nowrap",
              )}
            >
              {link.title}
            </Typography>

            <div className="flex items-center gap-1.5" title="URL">
              <LinkIcon className="stroke-foreground group-hover:stroke-primary h-4 w-4" />
              <Typography
                as="span"
                variant="small"
                className="overflow-x-hidden overflow-ellipsis whitespace-nowrap"
              >
                <span>{link.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
              </Typography>
            </div>

            <div className="flex w-full items-start justify-between gap-4">
              <div
                className="flex max-w-min items-center gap-1.5 overflow-x-hidden"
                title="Collection"
              >
                <CollectionIcon
                  size="small"
                  noCollection={!link.collection}
                  color={link.collection?.color ?? undefined}
                />
                <Typography
                  as="span"
                  variant="small"
                  className="overflow-x-hidden overflow-ellipsis whitespace-nowrap"
                >
                  {link.collection?.name ?? "Unorganized"}
                </Typography>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/links/${link.id}`);
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}
