import { useFetcher } from 'react-router';

import clsx from 'clsx';
import { Link, Link2, StarOffIcon, Tag } from 'lucide-react';

import type { Route } from '../routes/+types/Home';
import { Button } from './ui/button';
import { Typography } from './ui/typography';

type Props = {
  link: Route.ComponentProps['loaderData']['favorites'][number];
};

export function FavoriteLink({ link }: Props) {
  const remove = useFetcher();

  console.log('linkId ', remove.formData?.get('linkId'));

  if (remove.formData?.get('linkId')) return null;

  return (
    <a
      href={link.url}
      rel="noreferrer"
      target="_blank"
      className={clsx(
        'group block rounded focus-visible:ring-2 focus-visible:ring-muted-foreground min-h-20',
        'hover:!ring-primary hover:!ring-1',
      )}
    >
      <article
        className={clsx(
          'border rounded border-border h-full',
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
                className="rounded w-7 h-7 bg-cpt-crust border-1 border-border object-cover"
              />
            ) : (
              <Link2 width="28" height="28" />
            )}
          </div>

          <remove.Form
            method="post"
            className={clsx(
              'transition-opacity opacity-0 group-hover:opacity-100',
              'absolute top-2 right-2',
            )}
          >
            <input type="hidden" name="linkId" value={link.id} />
            <Button
              tabIndex={-1}
              variant="outline"
              name="intent"
              value="remove-favorite"
              size="xs"
              title="Remove from favorites"
            >
              <StarOffIcon />
            </Button>
          </remove.Form>
        </div>
      </article>
    </a>
  );
}
