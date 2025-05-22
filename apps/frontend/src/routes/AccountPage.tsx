import { jsonHash } from "remix-utils/json-hash";
import { Route } from "../../.react-router/types/src/routes/+types/AccountPage.ts";
import { authClient } from "../utility/authClient.ts";
import { redirect } from "react-router";
import { href } from "react-router";
import { Typography } from "../components/ui/typography.tsx";
import { CircleUserIcon } from "lucide-react";

export function clientLoader({}: Route.ClientLoaderArgs) {
  return jsonHash({
    async session() {
      const { data, error } = await authClient.getSession();
      if (error) throw redirect(href("/login"));
      return data;
    },
  });
}

export default function AccountPage({ loaderData }: Route.ComponentProps) {
  const { session: { user } } = loaderData;
  return (
    <div className="flex flex-1 max-w-screen-lg w-full mx-auto gap-4">
      <aside className="flex-1 flex flex-col gap-10 w-full bg-cpt-mantle rounded-md p-4">
        <div className="flex flex-col justify-center items-center text-center gap-2">
          {user.image
            ? <img src={user.image} alt="Profile picture" />
            : <CircleUserIcon className="w-24 h-24 stroke-muted-foreground" />}
          <Typography variant="title">{user.name}</Typography>
          <Typography variant="base" muted>{user.email}</Typography>
          <span className="border border-border rounded-md px-2 py-0.5 text-sm bg-muted">
            Subscription Plan
          </span>
        </div>

        <div className="rounded-md flex flex-col gap-2 w-full">
          <Typography muted variant="base" className="pb-4">Usage Stats</Typography>
          <Typography variant="base">Links</Typography>
          <Typography variant="base">Collections</Typography>
          <Typography variant="base">Tags</Typography>
        </div>

        <div className="rounded-md flex flex-col gap-2 w-full">
          <Typography muted variant="base" className="pb-4">
            Keyboard Shortcuts
          </Typography>
        </div>
      </aside>
      <div className="flex-[2] bg-cpt-surface0 w-full"></div>
    </div>
  );
}
