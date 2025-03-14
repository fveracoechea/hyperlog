import type { ComponentPropsWithRef, ElementType } from 'react';
import { Link, type LinkProps, NavLink, type NavLinkProps } from 'react-router';

import { type VariantProps, cva } from '@/lib/cva';
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

type RouterLinkProps = {
  as: 'link';
} & LinkProps;

type ALinkProps = {
  as: 'a';
} & ComponentPropsWithRef<'a'>;

type RouterNavLinkProps = {
  as: 'nav';
} & NavLinkProps;

const typography = cva({
  base: 'transition-colors',
  variants: {
    variant: {
      title: 'text-foreground text-xl font-medium leading-none',
      lead: 'text-3xl font-light leading-none',
      large: 'text-xl font-normal leading-loose',
      base: 'text-base font-normal leading-normal',
      small: 'text-sm font-normal leading-tight',
      xsmall: 'text-xs font-normal leading-tight',

      nav: [
        'text-cpt-subtext0 text-base font-normal hover:text-foreground leading-none',
        '[&.active]:text-foreground',
      ],
    },
    muted: {
      true: 'text-muted-foreground',
      false: '',
    },
    link: {
      true: 'underline underline-offset-4',
      false: '',
    },
  },
  compoundVariants: [
    {
      link: true,
      muted: true,
      className: ['text-muted-foreground hover:text-foreground'],
    },
    {
      link: true,
      muted: false,
      className: ['text-primary hover:text-primary/80'],
    },
  ],
  defaultVariants: {
    muted: false,
    link: false,
    variant: 'base',
  },
});

type Props = (
  | H1Props
  | H2Props
  | H3Props
  | H4Props
  | PProps
  | LabelProps
  | SpanProps
  | RouterLinkProps
  | RouterNavLinkProps
  | ALinkProps
) &
  VariantProps<typeof typography>;

export function Typography(props: Partial<Props>) {
  const { as: element, variant, className, muted, link: isLink, ...otherProps } = props;

  const linkProps: Partial<LinkProps> = {};

  let link = isLink ?? false;
  let Element: ElementType = element ?? 'span';

  if (Element === 'link') {
    Element = Link;
    link = true;
  }

  if (variant === 'nav') {
    Element = NavLink;
    linkProps.prefetch = 'intent';
  }

  return (
    <Element
      {...otherProps}
      {...linkProps}
      className={cn(typography({ variant, className, link, muted }))}
    />
  );
}
