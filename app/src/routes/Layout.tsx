import { Outlet, data } from 'react-router';

import { getSidebarData } from '@/.server/resources/dashboard';
import { getSessionOrRedirect } from '@/.server/session';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

import type { Route } from './+types/Layout';

export async function loader({ request }: Route.LoaderArgs) {
  const {
    data: { user },
    headers,
  } = await getSessionOrRedirect(request);

  return data(await getSidebarData(user.id), { headers });
}

export default function Layout() {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex flex-1 flex-col justify-between">
          <main className="bg-background flex flex-1 flex-col gap-6 p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
