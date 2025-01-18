import { Outlet, redirect } from 'react-router';

import { cookies } from '@/utility/cookies';
import { api, getSession } from '@/utility/hono';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

import type { Route } from './+types/Layout';

export async function loader({ request }: Route.LoaderArgs) {
  const response = await api.user.whoami.$get({}, getSession(request));
  const json = await response.json();

  console.log(json);

  if (!response.ok || !json.success) {
    // Types not being inferred because there is no error response in this endpoint
    // However the sessionMiddleware can respond with this format
    const error = json.error as unknown as { message: string };

    const headers = new Headers();
    headers.append('Set-Cookie', await cookies.info.set({ ...error, type: 'info' }));
    throw redirect('/login', { headers });
  }

  return json.data;
}

export default function Layout() {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col justify-between">
          <main className="p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
