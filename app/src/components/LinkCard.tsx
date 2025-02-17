import { useNavigate, useSearchParams } from 'react-router';

import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { EllipsisVerticalIcon, EyeIcon, FolderIcon, LinkIcon, TagIcon } from 'lucide-react';

import type { Route } from '../routes/+types/Home';
import { Typography } from './ui/typography';

type Props = {
  link: Awaited<Route.ComponentProps['loaderData']['recentActivityPromise']>[number];
};

export function LinkCard({ link }: Props) {
  const navigate = useNavigate();
  return (
    <a
      href={link.url}
      rel="noreferrer"
      target="_blank"
      className={clsx(
        'focus-visible:ring-muted-foreground group block rounded focus-visible:ring-2',
        'hover:ring-primary',
      )}
    >
      <article
        className={clsx(
          'border-border group-hover:border-primary h-full rounded border transition-colors',
          'flex flex-col',
        )}
      >
        {link.previewImage ? (
          <div
            className={clsx(
              'relative aspect-[1.91/1] rounded-t',
              'flex items-start justify-start p-2',
            )}
          >
            <img
              height="630"
              width="1200"
              src={link.previewImage}
              alt="Website preview"
              className="absolute inset-0 h-full w-full rounded-t object-cover"
            />
            {link.favicon && (
              <img
                src={link.favicon}
                width="32"
                height="32"
                role="presentation"
                className={clsx(
                  'border-muted-foreground relative h-8 w-8 rounded border-2',
                  'object-cover',
                )}
              />
            )}
            <div
              role="presentation"
              className={clsx(
                'absolute inset-0 h-full w-full transition-all',
                'from-cpt-base/80 via-cpt-base/10 to-cpt-base/0 bg-gradient-to-bl',
                'group-hover:from-cpt-base/90 group-hover:via-primary/30 group-hover:to-primary/40 bg-gradient-to-bl',
              )}
            />
            <button
              title="Show link details"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                navigate(`/links/${link.id}`);
              }}
              className={clsx(
                'absolute right-0 top-0 rounded-bl rounded-tr p-2 transition',
                'text-foreground bg-transparent hover:text-white',
                'hover:scale-125 active:!scale-100',
              )}
            >
              <EllipsisVerticalIcon className="h-6 w-6 stroke-current" />
            </button>
          </div>
        ) : (
          <div role="presentation" className="aspect-[1.91/1]" />
        )}
        <div className="flex flex-1 flex-col justify-between gap-2">
          <div className="flex flex-col gap-2 p-2">
            <Typography
              variant="base"
              className="group-hover:text-primary max-h-12 overflow-y-hidden"
            >
              {link.title}
            </Typography>

            <div className="flex items-center gap-1.5" title="URL">
              <LinkIcon className="stroke-muted-foreground group-hover:stroke-primary h-4 w-4" />
              <Typography as="span" variant="small" muted className="no-underline">
                {link.url}
              </Typography>
            </div>
            {link.tag ? (
              <div className="flex items-center gap-1.5" title="tag">
                <TagIcon className="stroke-muted-foreground group-hover:stroke-primary h-4 w-4" />
                <Typography as="span" variant="small" muted className="no-underline">
                  {link.tag.name}
                </Typography>
              </div>
            ) : (
              <div role="presentation" className="h-4" />
            )}
          </div>

          <div className="border-border flex w-full items-center justify-between gap-4 border-t p-2">
            {link.collection ? (
              <div
                className="flex max-w-min items-center gap-1.5 overflow-x-hidden"
                title="Collection"
              >
                <FolderIcon
                  className="h-4 w-4 min-w-4"
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
            ) : (
              <div />
            )}

            <div className="flex w-max items-center gap-1.5" title="Last visit">
              <EyeIcon className="stroke-muted-foreground h-4 w-4" />
              <Typography as="span" variant="xsmall" muted className="whitespace-nowrap">
                {formatDistanceToNow(link.lastVisit ?? Date.now(), {
                  addSuffix: true,
                })}
              </Typography>
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}
