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
        'group block min-h-20 rounded',
        'focus-visible:ring-muted-foreground focus-visible:ring-2',
        'hover:ring-primary',
      )}
    >
      <article
        className={clsx(
          'border-border relative h-full overflow-hidden rounded border',
          'group-hover:border-primary',
        )}
      >
        {link.previewImage && (
          <img
            src={link.previewImage}
            role="presentation"
            className="absolute inset-0 z-[1] h-full w-full object-cover"
          />
        )}
        <div
          className={clsx(
            'from-cpt-base via-cpt-base/90 to-cpt-base/60 relative z-[2] bg-gradient-to-r',
            'relative flex h-full flex-col justify-between gap-2 p-2',
          )}
        >
          <Typography
            as="h4"
            variant="small"
            className="group-hover:text-primary transition-colors"
          >
            {link.title}
          </Typography>
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <LinkIcon className="stroke-primary h-3.5 w-3.5" />
                <Typography as="span" variant="xsmall" className="no-underline">
                  {link.url}
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
                className="border-1 border-border h-7 w-7 rounded object-cover"
              />
            )}
          </div>

          {/* <remove.Form */}
          {/*   method="post" */}
          {/*   className={clsx( */}
          {/*     'transition-opacity opacity-0 group-hover:opacity-100', */}
          {/*     'absolute top-0 right-0', */}
          {/*   )} */}
          {/* > */}
          {/*   <input type="hidden" name="linkId" value={link.id} /> */}
          {/*   <Button */}
          {/*     tabIndex={-1} */}
          {/*     variant="outline" */}
          {/*     name="intent" */}
          {/*     value="remove-favorite" */}
          {/*     size="xs" */}
          {/*     title="Remove from favorites" */}
          {/*   > */}
          {/*     <StarOffIcon /> */}
          {/*   </Button> */}
          {/* </remove.Form> */}
        </div>
      </article>
    </a>
  );
}
