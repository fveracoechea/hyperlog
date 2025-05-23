import { ReactNode } from "react";
import { href, Outlet, redirect } from "react-router";
import { Header } from "../components/layout/Header.tsx";
import { Footer } from "../components/layout/Footer.tsx";

import { jsonHash } from "remix-utils/json-hash";
import { CircleUserIcon } from "lucide-react";

import { client } from "@/utility/honoClient.ts";
import { authClient } from "@/utility/authClient.ts";
import { Typography } from "@/components/ui/typography";
import { SignOutButton } from "@/routes/resources/signout";
import { PageErrorBoundary } from "@/components/PageErrorBoundary.tsx";

import type { Route } from "./+types/AccountLayout";

export const ErrorBoundary = PageErrorBoundary;

function ListItem(props: { title: string; detail: ReactNode }) {
  const { title, detail } = props;
  return (
    <li className="flex gap-4 w-full justify-between items-center">
      <Typography>{title}</Typography>
      {typeof detail === "string" || typeof detail === "number"
        ? <Typography>{detail}</Typography>
        : detail}
    </li>
  );
}

export function clientLoader({}: Route.ClientLoaderArgs) {
  return jsonHash({
    async ownedCollections() {
      const response = await client.api.collection.$get({ query: { type: "owned" } });
      return (await response.json()).data.collections;
    },
    async session() {
      const { data, error } = await authClient.getSession();
      if (error) throw redirect(href("/login"));
      return data;
    },
    async stats() {
      const response = await client.api.whoami.stats.$get();
      return (await response.json()).data;
    },
  });
}

export default function SettingsLayout({ loaderData }: Route.ComponentProps) {
  const { session: { user }, stats } = loaderData;
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col justify-between min-h-[calc(100vh-62px)]">
        <main className="bg-background xlg:p-8 flex flex-1 flex-col gap-10 p-4 lg:p-6">
          <div className="flex flex-1 max-w-screen-xl w-full mx-auto gap-4">
            <aside className="flex-1 flex flex-col gap-6 w-full p-4">
              <div className="flex flex-col justify-center items-center text-center gap-2">
                {user.image
                  ? (
                    <img
                      src={user.image}
                      height="96px"
                      width="96px"
                      className="rounded-full"
                      alt="Profile picture"
                    />
                  )
                  : <CircleUserIcon className="w-32 h-32 stroke-cpt-surface0" />}
                <Typography variant="title" className="mt-2">{user.name}</Typography>
                <Typography variant="base" muted>{user.email}</Typography>
                <span className="border border-border rounded-md px-2 py-0.5 text-sm bg-cpt-mantle">
                  Subscription Plan
                </span>
              </div>

              <div className="flex flex-col gap-4 w-full rounded-md px-4 py-2 border border-border">
                <Typography muted variant="small" as="h4">Usage Stats</Typography>

                <ul className="flex flex-col gap-2">
                  <ListItem title="Links" detail={stats.count.links} />
                  <ListItem title="Collections" detail={stats.count.collections} />
                  <ListItem title="Tags" detail={stats.count.tags} />
                </ul>
              </div>

              <div className="flex flex-col gap-2 w-full rounded-md px-4 py-2 border border-border">
                <Typography muted variant="small" className="pb-2" as="h4">
                  Keyboard Shortcuts
                </Typography>
                {/* ⌘ */}
                <ListItem
                  title="Search"
                  detail={
                    <span className="flex gap-1">
                      <Typography
                        variant="xsmall"
                        className="bg-cpt-crust rounded-md py-1 px-2"
                      >
                        Ctrl
                      </Typography>
                      <Typography
                        variant="xsmall"
                        className="bg-cpt-crust rounded-md py-1 px-2"
                      >
                        K
                      </Typography>
                    </span>
                  }
                />
                <ListItem
                  title="Create New"
                  detail={
                    <span className="flex gap-1">
                      <Typography
                        variant="xsmall"
                        className="bg-cpt-crust rounded-md py-1 px-2"
                      >
                        Ctrl
                      </Typography>
                      <Typography
                        variant="xsmall"
                        className="bg-cpt-crust rounded-md py-1 px-2"
                      >
                        Shift
                      </Typography>
                      <Typography
                        variant="xsmall"
                        className="bg-cpt-crust rounded-md py-1 px-2"
                      >
                        O
                      </Typography>
                    </span>
                  }
                />
                <ListItem
                  title="Toggle Sidebar"
                  detail={
                    <span className="flex gap-1">
                      <Typography
                        variant="xsmall"
                        className="bg-cpt-crust rounded-md py-1 px-2"
                      >
                        Ctrl
                      </Typography>
                      <Typography
                        variant="xsmall"
                        className="bg-cpt-crust rounded-md py-1 px-2"
                      >
                        B
                      </Typography>
                    </span>
                  }
                />
              </div>
              <SignOutButton />
            </aside>
            <div className="flex-[3] bg-cpt-mantle w-full">
              <Outlet />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
