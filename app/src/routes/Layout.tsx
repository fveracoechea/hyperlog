import { Outlet } from 'react-router';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

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
