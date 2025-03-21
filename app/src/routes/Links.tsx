import { data, useNavigation } from 'react-router';

import { PaginationSchema } from '@/.server/pagination';
import { getAllLinks } from '@/.server/resources/link';
import { getSessionOrRedirect } from '@/.server/session';
import { LinkIcon } from 'lucide-react';

import { Banner } from '@/components/Banner';
import { LinkCard } from '@/components/LinkCard';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { PaginationForm } from '@/components/PaginationForm';

import { type Route } from './+types/Links';

export const ErrorBoundary = PageErrorBoundary;

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
    <section className="flex flex-col gap-4">
      <Banner title="Links" Icon={LinkIcon} subtitle="All links from every collection" />

      <PaginationForm {...loaderData} />

      <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
        {loaderData.links.map(link => (
          <LinkCard isLoading={navigation.state === 'loading'} key={link.id} link={link} />
        ))}
      </div>
    </section>
  );
}
