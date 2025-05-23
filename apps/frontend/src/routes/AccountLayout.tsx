import { Outlet } from "react-router";
import { Header } from "../components/layout/Header.tsx";
import { Footer } from "../components/layout/Footer.tsx";

import { jsonHash } from "remix-utils/json-hash";

import { client } from "@/utility/honoClient.ts";
import type { Route } from "./+types/AccountLayout";

export function clientLoader({}: Route.ClientLoaderArgs) {
  return jsonHash({
    async ownedCollections() {
      const response = await client.api.collection.$get({ query: { type: "owned" } });
      return (await response.json()).data.collections;
    },
  });
}

export default function AccountLayout() {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col justify-between min-h-[calc(100vh-62px)]">
        <main className="bg-background xlg:p-8 flex flex-1 flex-col gap-10 p-4 lg:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
