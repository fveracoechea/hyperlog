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
        <div className="flex-1 flex flex-col justify-between">
          <main className="p-6 flex flex-col gap-6 bg-background flex-1">
            <Outlet />
          </main>
          <Footer />
          <ClientOnly>{() => <LinkDetailsDrawer />}</ClientOnly>
        </div>
      </div>
    </>
  );
}
