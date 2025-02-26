import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { CalendarClockIcon, FolderIcon, LinkIcon, TagIcon } from 'lucide-react';

import type { Route } from '../routes/+types/Home';
import { Typography } from './ui/typography';

type Props = {
  hideDetails?: boolean;
  isLoading?: boolean;
  link: Awaited<Route.ComponentProps['loaderData']['recentActivityPromise']>[number];
};

export function LinkCard({ link, hideDetails, isLoading }: Props) {
  return (
    <a
      href={link.url}
      rel="noreferrer"
      target="_blank"
      className={clsx(
        'focus-visible:ring-muted-foreground group block rounded-md',
        'hover:ring-primary focus-visible:ring-2',
        isLoading && 'cursor-wait opacity-50',
      )}
    >
      <article
        className={clsx(
          'border-border group-hover:border-primary h-full rounded-md border transition-colors',
          'flex flex-col bg-cover bg-center bg-no-repeat',
        )}
        style={{
          backgroundImage: `url("${link.previewImage}")`,
        }}
      >
        <div className="bg-cpt-base/85 flex flex-1 flex-col gap-4 rounded-md p-2 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            {link.favicon && (
              <img
                src={link.favicon}
                width="26"
                height="26"
                role="presentation"
                className="rounded"
              />
            )}

            <div className="flex items-center gap-1.5" title="Last visit">
              <CalendarClockIcon className="stroke-muted-foreground h-4 w-4" />
              <Typography as="span" variant="xsmall" className="whitespace-nowrap">
                {formatDistanceToNow(link.lastVisit ?? Date.now(), {
                  addSuffix: true,
                })}
              </Typography>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-between gap-2">
            <div
              className={clsx(
                hideDetails && 'min-h-10 justify-end',
                'flex flex-1 flex-col gap-1.5',
              )}
            >
              <Typography
                as="h4"
                className="group-hover:text-primary max-h-10 overflow-y-hidden text-left leading-tight"
              >
                {link.title}
              </Typography>

              {!hideDetails && (
                <div className="flex items-center gap-1.5" title="URL">
                  <LinkIcon className="stroke-muted-foreground group-hover:stroke-primary h-3.5 w-3.5" />
                  <Typography as="span" variant="small">
                    <span>{link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                  </Typography>
                </div>
              )}

              {!hideDetails && link.tag && (
                <div className="flex items-center gap-1.5" title="tag">
                  <TagIcon className="stroke-muted-foreground group-hover:stroke-primary h-3.5 w-3.5" />
                  <Typography as="span" variant="small" muted className="no-underline">
                    {link.tag.name}
                  </Typography>
                </div>
              )}

              {!hideDetails && link.collection && (
                <div
                  className="flex max-w-min items-center gap-1.5 overflow-x-hidden"
                  title="Collection"
                >
                  <FolderIcon
                    className="h-4 w-3.5 min-w-3.5"
                    style={{
                      stroke: link.collection.color ?? undefined,
                      fill: link.collection.color ?? undefined,
                    }}
                  />
                  <Typography
                    as="span"
                    variant="small"
                    muted
                    className="overflow-x-hidden overflow-ellipsis whitespace-nowrap"
                  >
                    {link.collection.name}
                  </Typography>
                </div>
              )}
            </div>

            {!hideDetails && (
              <div className="flex w-full items-center justify-end gap-4">
                <Typography
                  as="link"
                  variant="small"
                  to={`/links/${link.id}`}
                  onClick={e => e.stopPropagation()}
                  className="!text-foreground px-2 py-1 no-underline hover:underline focus:underline"
                >
                  View Details
                </Typography>
              </div>
            )}
          </div>
        </div>
      </article>
    </a>
  );
}
