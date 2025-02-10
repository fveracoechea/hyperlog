import { Form, data, useLoaderData, useNavigation, useSearchParams } from 'react-router';

import { PaginationSchema } from '@/.server/pagination';
import { getAllLinks } from '@/.server/resources/link';
import { getSessionOrRedirect } from '@/.server/session';
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

  // TODO: Remove
  await new Promise(r => setTimeout(r, 300));

  return data({ ...(await getAllLinks(user.id, params)), params }, { headers });
}

function LisPageForm() {
  const { params } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const isSearching =
    navigation.state !== 'idle' &&
    (new URLSearchParams(navigation.location.search).has('search') ||
      typeof params.search !== 'undefined');

  function onClearSearch() {
    searchParams.delete('search');
    setSearchParams(searchParams);
  }

  return (
    <Form className="flex gap-5 pt-4">
      <div className="flex flex-1 gap-4">
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
      </div>
      <div className="flex items-center gap-0">
        <Button variant="ghost" size="sm" title="First page" className="px-1.5">
          <ChevronFirstIcon className="min-h-5 min-w-5" />
        </Button>
        <Button variant="ghost" size="sm" title="First page" className="px-1.5">
          <ChevronLeftIcon className="min-h-5 min-w-5" />
        </Button>
        <Typography muted variant="small" className="px-2">
          Page 1 of 12
        </Typography>
        <Button variant="ghost" size="sm" title="First page" className="px-1.5">
          <ChevronRightIcon className="min-h-5 min-w-5" />
        </Button>
        <Button variant="ghost" size="sm" title="First page" className="px-1.5">
          <ChevronLastIcon className="min-h-5 min-w-5" />
        </Button>
      </div>
    </Form>
  );
}

export default function Links({ loaderData }: Route.ComponentProps) {
  const links = loaderData.data;
  return (
    <section className="flex flex-col gap-4">
      <Banner title="Links" Icon={LinkIcon} subtitle="All links from every collection" />

      <LisPageForm />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
        {links.map(link => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>
    </section>
  );
}
