import * as React from 'react';

import { cn } from '@/lib/utils';
import clsx from 'clsx';

const input = clsx([
  'flex gap-2 w-full rounded-md bg-background text-foreground',
  'px-2 py-2 ring-offset-background transition-all appearance-none',
  'placeholder:text-muted-foreground placeholder:font-normal',
  'text-sm md:text-base',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'autofill:!bg-background autofill:!text-foreground autofill:appearance-none',
]);

type Props = React.ComponentProps<'input'> & {
  icon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className, type, disabled, icon, ...props }, ref) => {
    const wrapper = clsx([
      'flex w-full justify-center items-center',
      'ring-offset-0 rounded-md border border-input bg-background text-foreground',
      'hover:ring-1 hover:ring-ring/50',
      'focus-within:outline-none focus-within:ring-1 focus-within:!ring-ring',
      disabled && 'cursor-not-allowed opacity-50',
    ]);

    return (
      <div className={wrapper}>
        {icon && <span className="pl-2">{icon}</span>}
        <input type={type} className={cn(input, className)} ref={ref} {...props} />
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
