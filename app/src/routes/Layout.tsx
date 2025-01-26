import { Outlet, data, redirect } from 'react-router';

import { cookies } from '@/utility/cookies';
import { api, assertResponse, getSession } from '@/utility/hono';
import { zJsonString } from '@hyperlog/shared';

import { LinkDetailsDrawer } from '@/components/LinkDetailsDrawer';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

import type { Route } from './+types/Layout';

async function getSidebarData(req: Request) {
  const response = await api.dashboard.sidebar.$get({ json: {} }, getSession(req));
  const json = await assertResponse(response);
  return json.data;
}

async function getWhoAmI(request: Request) {
  const response = await api.user.whoami.$get({ json: {} }, getSession(request));
  const whoAmI = await response.json();
  return { whoAmI, response };
}

export async function loader({ request }: Route.LoaderArgs) {
  console.log('layout loader');
  const [sidebar, { whoAmI, response }] = await Promise.all([
    getSidebarData(request),
    getWhoAmI(request),
  ]);

  if (!response.ok || !whoAmI.success) {
    // Types not being inferred because there is no error response in this endpoint
    // However the sessionMiddleware can respond with this format
    const error = whoAmI.error as unknown as { message: string };
    const headers = new Headers();
    headers.append('Set-Cookie', await cookies.info.set({ ...error, type: 'info' }));
    throw redirect('/login', { headers });
  }

  return data(
    {
      session: whoAmI.data.session,
      sidebar: sidebar,
    },
    { headers: response.headers },
  );
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const cacheKey = 'layout-loader';
  const cached = await zJsonString.safeParseAsync(sessionStorage.getItem(cacheKey));
  if (cached.success && cached.data) return cached.data as never;

  const serverData = await serverLoader();
  sessionStorage.setItem(cacheKey, JSON.stringify(serverData));
  return serverData;
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
          <LinkDetailsDrawer />
        </div>
      </div>
    </>
  );
}
