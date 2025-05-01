import type { ComponentPropsWithRef } from 'react';

import { LoaderCircleIcon, SearchIcon, XIcon } from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';

export function SearchInput(
  props: ComponentPropsWithRef<'input'> & { loading?: boolean; onClearSearch(): void },
) {
  const { loading, value, defaultValue, onClearSearch, ...inputProps } = props;
  return (
    <Input
      {...inputProps}
      value={value}
      defaultValue={defaultValue}
      autoFocus
      name='search'
      icon={loading
        ? <LoaderCircleIcon className='text-primary animate-spin' />
        : <SearchIcon className='text-muted-foreground' />}
      rightBtn={(value || defaultValue) && (
        <Button
          variant='ghost'
          title='Clear search'
          size='sm'
          type='button'
          onClick={onClearSearch}
        >
          <XIcon className='text-destructive' />
        </Button>
      )}
    />
  );
}
