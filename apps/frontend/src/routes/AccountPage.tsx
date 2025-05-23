import { jsonHash } from "remix-utils/json-hash";
import { Route } from "../../.react-router/types/src/routes/+types/AccountPage.ts";
import { authClient } from "../utility/authClient.ts";
import { redirect } from "react-router";
import { href } from "react-router";
import { Typography } from "../components/ui/typography.tsx";
import { CircleUserIcon, LogOutIcon } from "lucide-react";
import { Button } from "../components/ui/button.tsx";
import { client } from "../utility/honoClient.ts";

export function clientLoader({}: Route.ClientLoaderArgs) {
  return jsonHash({
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

function StatCount(props: { title: string; count: number }) {
  const { title, count } = props;
  return (
    <li className="flex gap-4 w-full justify-between items-center">
      <Typography>{title}</Typography>
      <Typography>{count}</Typography>
    </li>
  );
}

export default function AccountPage({ loaderData }: Route.ComponentProps) {
  const { session: { user }, stats } = loaderData;
  return (
    <div className="flex flex-1 max-w-screen-xl w-full mx-auto gap-4">
      <aside className="flex-1 flex flex-col gap-8 w-full p-4">
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
            <StatCount title="Links" count={stats.count.links} />
            <StatCount title="Collections" count={stats.count.collections} />
            <StatCount title="Tags" count={stats.count.tags} />
          </ul>
        </div>

        <div className="flex flex-col gap-2 w-full rounded-md px-4 py-2 border border-border">
          <Typography muted variant="small" className="pb-2" as="h4">
            Keyboard Shortcuts
          </Typography>
        </div>

        <Button variant="outline">
          <LogOutIcon />
          <span>Sign Out</span>
        </Button>
      </aside>
      <div className="flex-[3] bg-cpt-mantle w-full">
      </div>
    </div>
  );
}
