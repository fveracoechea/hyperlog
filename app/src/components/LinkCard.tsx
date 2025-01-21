import clsx from 'clsx';

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
        'hover:!ring-primary hover:!ring-1',
      )}
    >
      <article className="">
        {link.previewImage ? (
          <img
            height="630"
            width="1200"
            src={link.previewImage}
            alt="Website preview"
            className="aspect-[1.91/1] object-cover"
          />
        ) : (
          <div role="presentation" className="aspect-[1.91/1]" />
        )}
        <Typography variant="small">{link.title}</Typography>
      </article>
    </a>
  );
}
