import {
  Form,
  Link,
  data,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from 'react-router';

import { PaginationSchema } from '@/.server/pagination';
import { getAllLinks } from '@/.server/resources/link';
import { getSessionOrRedirect } from '@/.server/session';
import clsx from 'clsx';
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  LoaderCircleIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';

import { Banner } from '@/components/Banner';
import { LinkCard } from '@/components/LinkCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

import { type Route } from './+types/Links';

export async function loader({ request }: Route.LoaderArgs) {
  const {
    data: { user },
    headers,
  } = await getSessionOrRedirect(request);

  const params = PaginationSchema.parse(Object.fromEntries(new URL(request.url).searchParams));

  return data({ ...(await getAllLinks(user.id, params)), params }, { headers });
}

function LisPageForm() {
  const { params, totalRecords } = useLoaderData<typeof loader>();
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
    <div className="flex gap-5 pt-4">
      <Form className="flex flex-1 gap-4">
        <div className="w-1/2 max-w-96">
          <Input
            key={params.search}
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
        <div className="w-24">
          <Input placeholder="Sort By" />
        </div>
        <div className="w-24">
          <Input placeholder="Direction" />
        </div>
      </Form>
      <div className="flex items-center gap-0">
        <Button
          variant="ghost"
          size="sm"
          title="First page"
          disabled={params.page === 1}
          className="px-1.5"
          asChild
        >
          <Link to={getPaginationLink(1)}>
            <ChevronFirstIcon className="min-h-5 min-w-5" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={params.page === 1}
          title="Previous page"
          className="px-1.5"
          asChild
        >
          <Link to={getPaginationLink(Math.max(1, params.page - 1))}>
            <ChevronLeftIcon className="min-h-5 min-w-5" />
          </Link>
        </Button>
        <Typography muted variant="small" className="px-2">
          Page {params.page} of {lastPage}
        </Typography>
        <Button
          variant="ghost"
          size="sm"
          title="Next page"
          disabled={params.page === lastPage}
          className="px-1.5"
          asChild
        >
          <Link to={getPaginationLink(Math.min(lastPage, params.page + 1))}>
            <ChevronRightIcon className="min-h-5 min-w-5" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          title="First page"
          className="px-1.5"
          disabled={params.page === lastPage}
          asChild
        >
          <Link to={getPaginationLink(lastPage)}>
            <ChevronLastIcon className="min-h-5 min-w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function Links({ loaderData }: Route.ComponentProps) {
  const links = loaderData.data;
  const navigation = useNavigation();
  return (
    <section className="flex flex-col gap-4">
      <Banner title="Links" Icon={LinkIcon} subtitle="All links from every collection" />

      <LisPageForm />

      <div
        className={clsx(
          'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4',
          navigation.state !== 'idle' && 'opacity-50',
        )}
      >
        {links.map(link => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>
    </section>
  );
}
