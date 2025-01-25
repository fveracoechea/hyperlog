import { Outlet, data, redirect } from 'react-router';

import { cookies } from '@/utility/cookies';
import { api, assertResponse, getSession } from '@/utility/hono';

import { LinkDetailsDrawer } from '@/components/LinkDetailsDrawer';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

import type { Route } from './+types/Layout';

async function getLayoutData(req: Request) {
  const response = await api.dashboard.layout.$get({ json: {} }, getSession(req));
  const json = await assertResponse(response);
  return json.data;
}

export async function loader({ request }: Route.LoaderArgs) {
  const response = await api.user.whoami.$get({}, getSession(request));
  const whoami = await response.json();

  if (!response.ok || !whoami.success) {
    // Types not being inferred because there is no error response in this endpoint
    // However the sessionMiddleware can respond with this format
    const error = whoami.error as unknown as { message: string };

    const headers = new Headers();
    headers.append('Set-Cookie', await cookies.info.set({ ...error, type: 'info' }));
    throw redirect('/login', { headers });
  }

  return data(
    {
      session: whoami.data.session,
      layoutPromise: getLayoutData(request),
    },
    { headers: response.headers },
  );
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
