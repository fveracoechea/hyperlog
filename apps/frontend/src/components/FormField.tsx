import { type ComponentPropsWithRef, type ReactNode, useId } from 'react';

import { cn } from '@/lib/utils';

import { Input, type InputProps } from './ui/input';
import { Textarea, type TextareaProps } from './ui/textarea';
import { Typography } from './ui/typography';

type FieldTextareaProps = {
  variant: 'textarea';
} & TextareaProps;

type FieldInpuProps = {
  variant?: 'input';
} & InputProps;

type Props = {
  label: string;
  fieldClassName?: string;
  errorMessage?: string;
  rightBtn?: ReactNode;
} & (FieldInpuProps | FieldTextareaProps);

export function FormField(props: Props) {
  const {
    variant = 'input',
    label,
    fieldClassName,
    errorMessage,
    rightBtn,
    ...inputProps
  } = props;
  const id = useId();

  return (
    <div className={cn('flex flex-col gap-1', fieldClassName)}>
      <Typography as='label' htmlFor={id}>
        {label}
        {inputProps.required && <span className='text-cpt-red ml-1'>*</span>}
      </Typography>
      {variant === 'textarea' && (
        <Textarea
          id={id}
          error={Boolean(errorMessage)}
          {...(inputProps as ComponentPropsWithRef<'textarea'>)}
        />
      )}
      {variant === 'input' && (
        <Input
          id={id}
          error={Boolean(errorMessage)}
          rightBtn={rightBtn}
          {...(inputProps as ComponentPropsWithRef<'input'>)}
        />
      )}
      {errorMessage && (
        <Typography variant='small' className='text-destructive pt-1'>
          {errorMessage}
        </Typography>
      )}
    </div>
  );
}
