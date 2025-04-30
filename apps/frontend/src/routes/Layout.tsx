import { Outlet } from "react-router";

import { PageErrorBoundary } from "@/components/PageErrorBoundary";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

import type { Route } from "./+types/Layout";

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

export function clientLoader({}: Route.ClientLoaderArgs) {
  return {
    tags: [],
    collections: [],
  };
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
