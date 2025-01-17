import { type ComponentPropsWithRef, useId } from 'react';

import { cn } from '@/lib/utils';

import { Input } from './ui/input';
import { Typography } from './ui/typography';

type Props = {
  label: string;
  fieldClassName?: string;
  errorMessage?: string;
} & ComponentPropsWithRef<'input'>;

export function FormField(props: Props) {
  const { label, fieldClassName, errorMessage, ...inputProps } = props;
  const id = useId();

  return (
    <div className={cn('flex flex-col gap-1', fieldClassName)}>
      <Typography as="label" htmlFor={id}>
        {label}
        {inputProps.required && <span className="ml-2 text-cpt-red">*</span>}
      </Typography>
      <Input error={Boolean(errorMessage)} id={id} {...inputProps} />
      {errorMessage && (
        <Typography variant="small" className="text-destructive">
          {errorMessage}
        </Typography>
      )}
    </div>
  );
}
