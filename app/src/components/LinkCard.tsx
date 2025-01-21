import clsx from 'clsx';

import type { Route } from '../routes/+types/Home';
import { Typography } from './ui/typography';

type Props = {
  link: Route.ComponentProps['loaderData']['favorites'][number];
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
        {link.previewImage && <img src={link.previewImage} />}
        <Typography variant="small">{link.title}</Typography>
      </article>
    </a>
  );
}
