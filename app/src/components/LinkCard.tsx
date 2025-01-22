import clsx from 'clsx';
import { EllipsisVerticalIcon, Folder, Link, Tag } from 'lucide-react';

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
                'transition-colors bg-transparent group-hover:bg-cpt-surface2/50',
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
        <div className="p-2 flex flex-col gap-2">
          <Typography variant="small" className="group-hover:text-primary">
            {link.title}
          </Typography>

          <div className="flex gap-1.5 items-center">
            <Link className="h-4 w-4 stroke-primary" />
            <Typography as="span" variant="xsmall" className="no-underline">
              {link.url}
            </Typography>
          </div>
          {link.tag && (
            <div className="flex gap-1.5 items-center">
              <Tag className="h-4 w-4 stroke-primary" />
              <Typography as="span" variant="xsmall" className="no-underline">
                {link.tag.name}
              </Typography>
            </div>
          )}
          {link.collection && (
            <div className="flex gap-1.5 items-center">
              <Folder
                className="h-4 w-4"
                style={{ stroke: link.collection.color ?? undefined }}
              />
              <Typography as="span" variant="xsmall" className="no-underline">
                {link.collection.name}
              </Typography>
            </div>
          )}
        </div>
      </article>
    </a>
  );
}
