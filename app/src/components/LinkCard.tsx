import clsx from 'clsx';
import { formatDistance } from 'date-fns';
import {
  CalendarIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  FolderIcon,
  LinkIcon,
  TagIcon,
} from 'lucide-react';

import type { Route } from '../routes/+types/Home';
import { Button } from './ui/button';
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
        'hover:!ring-primary hover:!ring-1',
      )}
    >
      <article className="rounded border border-border h-full">
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
                'absolute inset-0 w-full h-full',
                'transition-colors bg-primary/0 group-hover:bg-primary/40',
              )}
            />
            <Button
              variant="secondary"
              size="xs"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              title="More options"
              tabIndex={-1}
            >
              <EllipsisVerticalIcon />
            </Button>
          </div>
        ) : (
          <div role="presentation" className="aspect-[1.91/1]" />
        )}
        <div className="flex flex-col gap-2 justify-between">
          <div className="p-2 flex flex-col gap-2">
            <Typography variant="small" className="group-hover:text-primary">
              {link.title}
            </Typography>

            <div className="flex gap-1.5 items-center" title="URL">
              <LinkIcon className="h-3.5 w-3.5 stroke-muted-foreground group-hover:stroke-primary" />
              <Typography as="span" variant="xsmall" muted className="no-underline">
                {link.url}
              </Typography>
            </div>
            {link.tag ? (
              <div className="flex gap-1.5 items-center" title="tag">
                <TagIcon className="h-3.5 w-3.5 stroke-muted-foreground group-hover:stroke-primary" />
                <Typography as="span" variant="xsmall" muted className="no-underline">
                  {link.tag.name}
                </Typography>
              </div>
            ) : (
              <div role="presentation" className="h-4" />
            )}
          </div>

          <div className="p-2 flex gap-4 items-center w-full border-t border-border justify-between">
            {link.collection ? (
              <div className="flex gap-1.5 items-center" title="Collection">
                <FolderIcon
                  className="h-4 w-4"
                  style={{ stroke: link.collection.color ?? undefined }}
                />
                <Typography as="span" variant="xsmall" muted className="">
                  {link.collection.name}
                </Typography>
              </div>
            ) : (
              <div />
            )}

            <div className="flex gap-1.5 items-center" title="Last visit">
              <EyeIcon className="h-4 w-4 stroke-muted-foreground" />
              <Typography as="span" variant="xsmall" muted className="">
                {formatDistance(link.lastVisit ?? Date.now(), Date.now(), { addSuffix: true })}
              </Typography>
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}
