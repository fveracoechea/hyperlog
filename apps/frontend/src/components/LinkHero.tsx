import type { ReactNode } from 'react';

import { formatDate, formatDistanceToNow } from 'date-fns';
import { CalendarClockIcon, EyeIcon, PencilIcon, SaveIcon, StarIcon } from 'lucide-react';

import type { Route } from '../routes/+types/LinkDetails';
import { LazyFavicon } from './LazyFavicon';
import { Typography } from './ui/typography';

export type LinkData = Route.ComponentProps['loaderData']['link'];

export function LinkHero(props: {
  link: LinkData;
  actions?: ReactNode;
  isEditMode?: boolean;
}) {
  const { link, actions, isEditMode } = props;
  return (
    <section className='border-border relative flex min-h-[30vh] overflow-hidden rounded-md border'>
      <img
        role='presentation'
        height='630'
        width='1200'
        className='absolute inset-0 object-cover blur-[5px]'
        src={link.previewImage ?? undefined}
      />
      <div className='bg-cpt-mantle/90 relative flex flex-1 flex-col justify-between gap-8 p-4'>
        <div className='flex justify-between gap-8'>
          <LazyFavicon src={link.favicon ?? undefined} width='32px' height='32px' />
          {link.isPinned
            ? <StarIcon className='fill-primary stroke-primary h-6 w-6' />
            : <div role='presentation' />}
        </div>

        <div className='z-[1] flex flex-col gap-2 text-left'>
          {isEditMode
            ? (
              <div className='flex items-center gap-2 pb-4'>
                <PencilIcon />
                <Typography as='h2' variant='lead'>
                  Editing
                </Typography>
              </div>
            )
            : (
              <Typography as='h2' variant='lead'>
                {link.title}
              </Typography>
            )}
          <Typography as='p'>{link.description}</Typography>

          <div className='flex gap-2' title='Last Saved'>
            <SaveIcon className='h-5 w-5' />
            <Typography muted>{formatDate(link.updatedAt ?? new Date(), 'PPPp')}</Typography>
          </div>

          <div className='flex gap-2' title='Last Visit'>
            <CalendarClockIcon className='h-5 w-5' />
            <Typography muted>
              {formatDistanceToNow(link.lastVisit ?? new Date(), { addSuffix: true })}
            </Typography>
          </div>

          <div className='flex gap-2' title='Views'>
            <EyeIcon className='h-5 w-5' />
            <Typography muted>{link.views}</Typography>
          </div>

          {actions && <div className='flex justify-end gap-2'>{actions}</div>}
        </div>
      </div>
    </section>
  );
}
