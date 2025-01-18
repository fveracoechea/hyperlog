import type { ReactNode } from 'react';

import { type VariantProps, cva } from '@/lib/cva';
import { cn } from '@/lib/utils';
import { Info, TriangleAlert } from 'lucide-react';

import { Typography } from './typography';

const alert = cva({
  base: 'flex gap-2 px-4 py-2 border rounded items-center',
  variants: {
    variant: {
      info: ['boorder-cpt-sky bg-cpt-sky/15'],
      destructive: ['border-destructive bg-destructive/15'],
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

type Props = VariantProps<typeof alert> & {
  className?: string;
  children: ReactNode;
};

export function Alert(props: Props) {
  const { variant = 'info', className, children } = props;
  return (
    <div role="alert" className={cn(alert({ variant }), className)}>
      {variant === 'info' && <Info className="text-cpt-sky" width="24" height="24" />}
      {variant === 'destructive' && <TriangleAlert className="text-destructive h-6 w-6" />}
      <Typography variant="small">{children}</Typography>
    </div>
  );
}
