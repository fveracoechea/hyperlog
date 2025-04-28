import type { ComponentProps, FC } from 'react';
import { Form, Link, type To, useNavigation, useSearchParams } from 'react-router';

import type { PaginationSchemaType } from '@/.server/pagination';
import clsx from 'clsx';
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  type LucideProps,
} from 'lucide-react';

import { SearchInput } from './SearchInput';
import { Button } from './ui/button';
import { Typography } from './ui/typography';

type BtnPaginationVariant = 'first' | 'previous' | 'next' | 'last';

const PaginationProps: Record<
  BtnPaginationVariant,
  { Icon: FC<LucideProps & React.RefAttributes<SVGSVGElement>>; title: string }
> = {
  first: { Icon: ChevronFirstIcon, title: 'First Page' },
  previous: { Icon: ChevronLeftIcon, title: 'Previous Page' },
  next: { Icon: ChevronRightIcon, title: 'Next Page' },
  last: { Icon: ChevronLastIcon, title: 'Last Page' },
};

export function PaginationButton(
  props: {
    to?: To;
    variant: BtnPaginationVariant;
    loading?: boolean;
  } & ComponentProps<'button'>,
) {
  const { disabled, to, loading, variant, ...btnProps } = props;
  const { title, Icon } = PaginationProps[variant];
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={disabled}
      title={title}
      className={clsx('px-1.5', loading && 'cursor-wait')}
      asChild
    >
      {disabled || !to ? (
        <button {...btnProps}>
          <Icon className="min-h-5 min-w-5" />
        </button>
      ) : (
        <Link to={to}>
          <Icon className="min-h-5 min-w-5" />
        </Link>
      )}
    </Button>
  );
}

// TODO: ADD SorBy and Direction dropdowns
export function PaginationForm(props: { params: PaginationSchemaType; totalRecords: number }) {
  const { params, totalRecords } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const loading = navigation.state === 'loading';
  const lastPage = Math.ceil(totalRecords / params.pageSize);

  const isSearching =
    navigation.state !== 'idle' &&
    (new URLSearchParams(navigation.location.search).has('search') ||
      typeof params.search !== 'undefined');

  function getPaginationLink(page: number) {
    const pagination = new URLSearchParams(searchParams);
    pagination.set('page', String(page));
    return `/links?${pagination}`;
  }

  function onClearSearch() {
    searchParams.delete('search');
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  }

  return (
    <div className="flex gap-5">
      <Form className="flex flex-1 gap-4">
        <div className="w-1/2 min-w-80 max-w-screen-sm">
          <SearchInput
            key={params.search}
            loading={isSearching}
            defaultValue={params.search || ''}
            placeholder="Search by Title or URL"
            onClearSearch={onClearSearch}
          />
        </div>
      </Form>
      <div className="flex items-center gap-0">
        <PaginationButton
          variant="first"
          disabled={params.page === 1}
          to={getPaginationLink(1)}
          loading={loading}
        />
        <PaginationButton
          variant="previous"
          disabled={params.page === 1}
          to={getPaginationLink(Math.max(1, params.page - 1))}
          loading={loading}
        />
        <Typography muted variant="small" className="px-2">
          Page {params.page} of {lastPage}
        </Typography>
        <PaginationButton
          variant="next"
          disabled={params.page === lastPage}
          to={getPaginationLink(Math.min(lastPage, params.page + 1))}
          loading={loading}
        />
        <PaginationButton
          variant="last"
          disabled={params.page === lastPage}
          to={getPaginationLink(lastPage)}
          loading={loading}
        />
      </div>
    </div>
  );
}
