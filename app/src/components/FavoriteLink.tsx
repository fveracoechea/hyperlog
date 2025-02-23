import { useFetcher } from 'react-router';

import clsx from 'clsx';
import { LinkIcon, TagIcon } from 'lucide-react';

import type { Route } from '../routes/+types/Home';
import { Typography } from './ui/typography';

type Props = {
  link: Route.ComponentProps['loaderData']['favorites'][number];
};

export function FavoriteLink({ link }: Props) {
  const remove = useFetcher();
  if (remove.formData?.get('linkId')) return null;
  return (
    <a
      href={link.url}
      rel="noreferrer"
      target="_blank"
      data-linkid={link.id}
      className={clsx(
        'group block min-h-20 rounded-md',
        'focus-visible:ring-muted-foreground focus-visible:ring-2',
        'hover:ring-primary',
      )}
    >
      <article
        className={clsx(
          'border-border relative h-full overflow-hidden rounded-md border',
          'group-hover:border-primary bg-cover bg-center bg-no-repeat',
        )}
        style={{
          backgroundImage: `url("${link.previewImage}")`,
        }}
      >
        <div className="bg-cpt-base/90 flex h-full flex-col justify-between gap-2 p-2">
          <Typography
            as="h4"
            className="group-hover:text-primary max-h-12 overflow-y-hidden text-left leading-tight"
          >
            {link.title}
          </Typography>
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <LinkIcon className="stroke-primary h-3.5 w-3.5" />
                <Typography as="span" variant="small" className="no-underline">
                  <span>{link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                </Typography>
              </div>
              {link.tag && (
                <div className="flex items-center gap-1.5">
                  <TagIcon className="stroke-primary h-3.5 w-3.5" />
                  <Typography as="span" variant="xsmall" className="no-underline">
                    {link.tag.name}
                  </Typography>
                </div>
              )}
            </div>
            {link.favicon && (
              <img
                src={link.favicon}
                width="28"
                height="28"
                role="presentation"
                className="border-border h-7 w-7 rounded border-2 object-cover"
              />
            )}
          </div>
        </div>
      </article>
    </a>
  );
}
