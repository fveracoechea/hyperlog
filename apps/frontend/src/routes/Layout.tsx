import { Outlet } from 'react-router';

import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

import { jsonHash } from 'remix-utils/json-hash';

import { client } from '@/utility/honoClient.ts';

import type { Route } from './+types/Layout';

export function ErrorBoundary(props: Route.ErrorBoundaryProps) {
  return (
    <>
      <Header />
      <div className='flex'>
        <Sidebar />
        <div className='flex flex-1 flex-col justify-between'>
          <main className='bg-background xlg:p-8 flex flex-1 flex-col gap-10 p-4 lg:p-6'>
            <PageErrorBoundary {...props} />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export function clientLoader({}: Route.ClientLoaderArgs) {
  return jsonHash({
    async collections() {
      const response = await client.api.collection.parent.$get();
      const json = await response.json();
      return json.data.collections;
    },
    async tags() {
      const response = await client.api.tag.$get();
      const json = await response.json();
      return json.data.tags;
    },
  });
}

export default function Layout() {
  return (
    <>
      <Header />
      <div className='flex'>
        <Sidebar />
        <div className='flex flex-1 flex-col justify-between'>
          <main className='bg-background xlg:p-8 flex flex-1 flex-col gap-10 p-4 lg:p-6'>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
