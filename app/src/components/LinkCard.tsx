import { useRef } from 'react';
import { useFetcher, useNavigate } from 'react-router';

import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { CalendarClockIcon, LinkIcon } from 'lucide-react';

import type { Route } from '../routes/+types/Home';
import { CollectionIcon } from './CollectionIcon';
import { LazyFavicon } from './LazyFavicon';
import { Button } from './ui/button';
import { Typography } from './ui/typography';

type LinkData = Route.ComponentProps['loaderData']['recentActivity'][number];
type LinkType = Omit<LinkData, 'tag' | 'collection'> &
  Partial<Pick<LinkData, 'tag' | 'collection'>>;

type Props = {
  hideDetails?: boolean;
  isLoading?: boolean;
  link: LinkType;
};

export function LinkCard({ link, hideDetails, isLoading }: Props) {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <a
      href={link.url}
      title={link.notes ?? ''}
      rel="noreferrer"
      target="_blank"
      onClick={() => formRef.current?.requestSubmit()}
      className={clsx(
        'focus-visible:ring-muted-foreground group block rounded-md focus-visible:ring-2',
        isLoading && 'cursor-wait opacity-50',
      )}
    >
      <fetcher.Form
        method="PUT"
        action={`/api/link/${link.id}`}
        ref={formRef}
        className="hidden"
      />
      <article
        className={clsx(
          'border-border group-hover:border-primary h-full rounded-md border transition-colors',
          'relative flex flex-col overflow-hidden',
        )}
      >
        <img
          role="presentation"
          height="630"
          width="1200"
          loading="lazy"
          className="absolute inset-0 object-cover object-center blur"
          src={link.previewImage ?? undefined}
        />
        <div className="bg-cpt-base/80 relative flex flex-1 flex-col gap-4 rounded-md p-2">
          <div className="flex items-start justify-between">
            <LazyFavicon src={link.favicon ?? undefined} width="26px" height="26px" />

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
                className={clsx(
                  'group-hover:text-primary overflow-y-hidden text-left leading-tight',
                  'max-h-5 overflow-x-hidden overflow-ellipsis whitespace-nowrap',
                )}
              >
                {link.title}
              </Typography>

              <div className="flex items-center gap-1.5" title="URL">
                <LinkIcon className="stroke-muted-foreground group-hover:stroke-primary h-3.5 w-3.5" />
                <Typography
                  as="span"
                  variant="small"
                  className="overflow-x-hidden overflow-ellipsis whitespace-nowrap"
                >
                  <span>{link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                </Typography>
              </div>

              {!hideDetails && link.collection && (
                <div
                  className="flex max-w-min items-center gap-1.5 overflow-x-hidden"
                  title="Collection"
                >
                  <CollectionIcon size="small" color={link.collection.color ?? undefined} />
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/links/${link.id}`);
                  }}
                >
                  View Details
                </Button>
              </div>
            )}
          </div>
        </div>
      </article>
    </a>
  );
}
