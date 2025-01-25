import clsx from 'clsx';
import { formatDistance } from 'date-fns';
import { EllipsisVerticalIcon, EyeIcon, FolderIcon, LinkIcon, TagIcon } from 'lucide-react';

import type { Route } from '../routes/+types/Home';
import { Typography } from './ui/typography';

type Props = {
  link: Awaited<Route.ComponentProps['loaderData']['recentActivityPromise']>[number];
};

export function LinkCard({ link }: Props) {
  return (
    <a
      href={link.url}
      rel="noreferrer"
      target="_blank"
      className={clsx(
        'group block rounded focus-visible:ring-2 focus-visible:ring-muted-foreground',
        'hover:ring-primary',
      )}
    >
      <article className="transition-colors rounded border border-border h-full group-hover:border-primary">
        {link.previewImage ? (
          <div
            className={clsx(
              'relative rounded-t aspect-[1.91/1]',
              'flex justify-start items-start p-2',
            )}
          >
            <img
              height="630"
              width="1200"
              src={link.previewImage}
              alt="Website preview"
              className="absolute inset-0 w-full h-full object-cover rounded-t"
            />
            {link.favicon && (
              <img
                src={link.favicon}
                width="40"
                height="40"
                role="presentation"
                className={clsx(
                  'relative rounded w-10 h-10 border-2 border-muted-foreground',
                  'object-cover',
                )}
              />
            )}
            <div
              role="presentation"
              className={clsx(
                'absolute inset-0 w-full h-full transition-colors',
                'bg-gradient-to-bl from-cpt-base/80 via-cpt-base/10 to-cpt-base/0',
                'bg-gradient-to-bl group-hover:from-cpt-base/90 group-hover:via-primary/30  group-hover:to-primary/40',
              )}
            />
            <form onSubmit={e => e.preventDefault()}>
              <button
                onClick={e => e.stopPropagation()}
                className={clsx(
                  'absolute top-0 right-0 transition p-2 rounded-bl rounded-tr',
                  'bg-transparent text-foreground hover:text-white',
                  'hover:scale-125 active:!scale-100',
                )}
              >
                <EllipsisVerticalIcon className="h-6 w-6 stroke-current" />
              </button>
            </form>
          </div>
        ) : (
          <div role="presentation" className="aspect-[1.91/1]" />
        )}
        <div className="flex flex-col gap-2 justify-between">
          <div className="p-2 flex flex-col gap-2">
            <Typography variant="base" className="group-hover:text-primary">
              {link.title}
            </Typography>

            <div className="flex gap-1.5 items-center" title="URL">
              <LinkIcon className="h-4 w-4 stroke-muted-foreground group-hover:stroke-primary" />
              <Typography as="span" variant="small" muted className="no-underline">
                {link.url}
              </Typography>
            </div>
            {link.tag ? (
              <div className="flex gap-1.5 items-center" title="tag">
                <TagIcon className="h-4 w-4 stroke-muted-foreground group-hover:stroke-primary" />
                <Typography as="span" variant="small" muted className="no-underline">
                  {link.tag.name}
                </Typography>
              </div>
            ) : (
              <div role="presentation" className="h-4" />
            )}
          </div>

          <div className="p-2 flex gap-4 items-center w-full border-t border-border justify-between">
            {link.collection ? (
              <div
                className="flex gap-1.5 items-center max-w-min overflow-x-hidden"
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
                  className="whitespace-nowrap overflow-x-hidden overflow-ellipsis"
                >
                  {link.collection.name}
                </Typography>
              </div>
            ) : (
              <div />
            )}

            <div className="flex gap-1.5 items-center w-max" title="Last visit">
              <EyeIcon className="h-4 w-4 stroke-muted-foreground" />
              <Typography as="span" variant="xsmall" muted className="whitespace-nowrap">
                {formatDistance(link.lastVisit ?? Date.now(), Date.now(), { addSuffix: true })}
              </Typography>
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}
