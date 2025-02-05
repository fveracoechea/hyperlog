import { Outlet, data, useSearchParams } from 'react-router';

import { api, assertResponse, getSession } from '@/utility/hono';
import { ClientOnly } from 'remix-utils/client-only';

import { LinkDetailsDrawer } from '@/components/LinkDetailsDrawer';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

import type { Route } from './+types/Layout';

export async function loader({ request }: Route.LoaderArgs) {
  const response = await api.dashboard.sidebar.$get({ json: {} }, getSession(request));
  const json = await assertResponse(response);
  return data(json.data, { headers: response.headers });
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
          <ClientOnly>{() => <LinkDetailsDrawer />}</ClientOnly>
        </div>
      </div>
    </>
  );
}
