import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/lib/utils';

type H1Props = {
  as: 'h1';
} & ComponentPropsWithRef<'h1'>;

type H2Props = {
  as: 'h2';
} & ComponentPropsWithRef<'h2'>;

type H3Props = {
  as: 'h3';
} & ComponentPropsWithRef<'h3'>;

type H4Props = {
  as: 'h4';
} & ComponentPropsWithRef<'h4'>;

type PProps = {
  as: 'p';
} & ComponentPropsWithRef<'p'>;

type LabelProps = {
  as: 'label';
} & ComponentPropsWithRef<'label'>;

type SpanProps = {
  as: 'span';
} & ComponentPropsWithRef<'span'>;

type Props = H1Props | H2Props | H3Props | H4Props | PProps | LabelProps | SpanProps;

export function Typography(props: Partial<Props>) {
  switch (props.as) {
    case 'p':
      return (
        <p
          {...props}
          className={cn('leading-6 [&:not(:first-child)]:mt-6', props.className)}
        />
      );
    case 'h1':
      return (
        <h1
          {...props}
          className={cn(
            'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
            props.className,
          )}
        />
      );
    case 'h2':
      return (
        <h2
          {...props}
          className={cn(
            'mt-10 scroll-m-20  text-3xl font-semibold tracking-tight transition-colors first:mt-0',
            props.className,
          )}
        />
      );
    case 'h3':
      return (
        <h3
          {...props}
          className={cn(
            'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
            props.className,
          )}
        />
      );
    case 'h4':
      return (
        <h4
          {...props}
          className={cn('scroll-m-20 text-xl font-semibold tracking-tight', props.className)}
        />
      );
    case 'label':
      return (
        <label
          {...props}
          className={cn('text-sm font-medium leading-none', props.className)}
        />
      );
    default:
      return <span {...props} />;
  }
}
