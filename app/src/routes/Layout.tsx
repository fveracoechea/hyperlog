import { Outlet, data } from 'react-router';

import { getMyCollections } from '@/.server/resources/collection';
import { getMyTags } from '@/.server/resources/tag';
import { getSessionOrRedirect } from '@/.server/session';

import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

import type { Route } from './+types/Layout';

export function ErrorBoundary(props: Route.ErrorBoundaryProps) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex flex-1 flex-col justify-between">
          <main className="bg-background xlg:p-8 flex flex-1 flex-col gap-10 p-4 lg:p-6">
            <PageErrorBoundary {...props} />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const {
    data: { user },
    headers,
  } = await getSessionOrRedirect(request);

  const [tags, collections] = await Promise.all([
    getMyTags(user.id),
    getMyCollections(user.id, { onlyParentCollections: true }),
  ]);

  return data(
    {
      tags,
      collections,
    },
    { headers },
  );
}

export default function Layout() {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex flex-1 flex-col justify-between">
          <main className="bg-background xlg:p-8 flex flex-1 flex-col gap-10 p-4 lg:p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
