import { Link, data, isRouteErrorResponse, useNavigation } from 'react-router';

import { PaginationSchema } from '@/.server/pagination';
import { getAllLinks } from '@/.server/resources/link';
import { getSessionOrRedirect } from '@/.server/session';
import clsx from 'clsx';
import { Link2OffIcon, LinkIcon } from 'lucide-react';

import { Banner } from '@/components/Banner';
import { LinkCard } from '@/components/LinkCard';
import { PaginationForm } from '@/components/PaginationForm';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import { type Route } from './+types/Links';

export function ErrorBoundary(props: Route.ErrorBoundaryProps) {
  let headline = 'Oops, an unexpected error occurred';
  let message =
    'We apologize for the inconvenience. Please try again later. If the issue persists, contact support.';

  if (isRouteErrorResponse(props.error) && props.error.status === 404) {
    headline = 'Link Not Found';
    message = 'The requested page could not be found';
  }

  return (
    <section className="mx-auto flex max-w-96 flex-1 items-center pb-10">
      <div className="flex flex-col items-center gap-4">
        <Link2OffIcon className="stroke-cpt-surface1 h-24 w-24" />
        <div className="flex flex-col justify-center gap-0 text-center">
          <Typography variant="large">{headline}</Typography>
          <Typography muted>{message}</Typography>
        </div>
        <Button asChild>
          <Link to="/" replace>
            Go to Homepage
          </Link>
        </Button>
      </div>
    </section>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const {
    data: { user },
    headers,
  } = await getSessionOrRedirect(request);

  const params = PaginationSchema.parse(Object.fromEntries(new URL(request.url).searchParams));
  const result = await getAllLinks(user.id, params);
  return data({ ...result, params }, { headers });
}

export default function Links({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();

  return (
    <section className="flex flex-col gap-6">
      <Banner title="Links" Icon={LinkIcon} subtitle="All links from every collection" />

      <PaginationForm {...loaderData} />

      <div
        className={clsx(
          'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4',
        )}
      >
        {loaderData.links.map(link => (
          <LinkCard isLoading={navigation.state === 'loading'} key={link.id} link={link} />
        ))}
      </div>
    </section>
  );
}
