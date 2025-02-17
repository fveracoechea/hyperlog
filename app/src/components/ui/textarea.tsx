import * as React from 'react';

import { cn } from '@/lib/utils';

export type TextareaProps = React.ComponentProps<'textarea'> & { error?: boolean };

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'bg-background placeholder:text-muted-foreground transition-shadow',
          'outline-none ring-1 hover:ring-2 focus-visible:ring-2',
          'flex min-h-[80px] w-full rounded-md px-2 py-2 text-base',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'ring-destructive/60 focus-visible:!ring-destructive'
            : 'ring-input hover:ring-ring/40 focus-visible:!ring-ring',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
