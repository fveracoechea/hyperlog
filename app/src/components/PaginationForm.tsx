import { Form, Link, type To, useNavigation, useSearchParams } from 'react-router';

import type { PaginationSchemaType } from '@/.server/pagination';
import clsx from 'clsx';
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LoaderCircleIcon,
  type LucideProps,
  SearchIcon,
  XIcon,
} from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Typography } from './ui/typography';

function PaginationButton(props: {
  title: string;
  disabled?: boolean;
  to: To;
  Icon: React.FunctionComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;
}) {
  const navigation = useNavigation();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={props.disabled}
      title={props.title}
      className={clsx('px-1.5', navigation.state === 'loading' && 'cursor-wait')}
      asChild
    >
      {props.disabled ? (
        <button>
          <props.Icon className="min-h-5 min-w-5" />
        </button>
      ) : (
        <Link to={props.to}>
          <props.Icon className="min-h-5 min-w-5" />
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
        <div className="w-1/2 min-w-80 max-w-(--breakpoint-sm)">
          <Input
            key={params.search}
            autoFocus
            name="search"
            defaultValue={params.search || ''}
            icon={
              isSearching ? (
                <LoaderCircleIcon className="text-primary animate-spin" />
              ) : (
                <SearchIcon className="text-muted-foreground" />
              )
            }
            placeholder="Search by Title or URL"
            rightBtn={
              params.search && (
                <Button
                  variant="ghost"
                  title="Clear search"
                  size="sm"
                  type="button"
                  onClick={onClearSearch}
                >
                  <XIcon className="text-destructive" />
                </Button>
              )
            }
          />
        </div>
      </Form>
      <div className="flex items-center gap-0">
        <PaginationButton
          title="First Page"
          disabled={params.page === 1}
          to={getPaginationLink(1)}
          Icon={ChevronFirstIcon}
        />
        <PaginationButton
          title="Previous Page"
          disabled={params.page === 1}
          to={getPaginationLink(Math.max(1, params.page - 1))}
          Icon={ChevronLeftIcon}
        />
        <Typography muted variant="small" className="px-2">
          Page {params.page} of {lastPage}
        </Typography>
        <PaginationButton
          title="Next Page"
          disabled={params.page === lastPage}
          to={getPaginationLink(Math.min(lastPage, params.page + 1))}
          Icon={ChevronRightIcon}
        />
        <PaginationButton
          title="Last Page"
          disabled={params.page === lastPage}
          to={getPaginationLink(lastPage)}
          Icon={ChevronLastIcon}
        />
      </div>
    </div>
  );
}
