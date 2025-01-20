import clsx from 'clsx';
import { Link, Link2, Tag } from 'lucide-react';

import type { Route } from '../routes/+types/Home';
import { Typography } from './ui/typography';

type Props = {
  link: Route.ComponentProps['loaderData']['favorites'][number];
};

export function FavoriteLink({ link }: Props) {
  return (
    <a
      href={link.url}
      rel="noreferrer"
      target="_blank"
      className={clsx(
        'block rounded focus-visible:ring-2 focus-visible:ring-muted-foreground min-h-20',
        'hover:!ring-primary hover:!ring-1',
      )}
    >
      <article
        className={clsx(
          'group border rounded border-border h-full',
          'relative overflow-hidden transition-shadow',
        )}
      >
        {link.previewImage && (
          <img
            src={link.previewImage}
            role="presentation"
            className="absolute inset-0 h-full w-full z-[1] object-cover"
          />
        )}
        <div
          className={clsx(
            'relative z-[2] bg-cpt-base/80',
            'p-2 flex flex-col gap-2 justify-between relative h-full',
          )}
        >
          <div className="flex flex-col gap-1">
            <Typography
              as="h4"
              variant="small"
              className="transition-colors group-hover:text-primary"
            >
              {link.title}
            </Typography>
            <div className="flex gap-1.5 items-center">
              <Link className="h-3.5 w-3.5 stroke-primary" />
              <Typography as="span" variant="xsmall" className="no-underline">
                {link.url}
              </Typography>
            </div>
            {link.tag && (
              <div className="flex gap-1.5 items-center">
                <Tag className="h-3.5 w-3.5 stroke-primary" />
                <Typography as="span" variant="xsmall" className="no-underline">
                  {link.tag.name}
                </Typography>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4">
            {link.favicon ? (
              <img
                src={link.favicon}
                width="28"
                height="28"
                role="presentation"
                className="rounded bg-cpt-crust border-1 border-border"
              />
            ) : (
              <Link2 width="28" height="28" />
            )}
          </div>
        </div>
      </article>
    </a>
  );
}
