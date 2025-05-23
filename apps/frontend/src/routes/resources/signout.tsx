import { href, redirect, useFetcher } from "react-router";
import { authClient } from "@/utility/authClient.ts";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon, LogOutIcon } from "lucide-react";

export async function clientAction() {
  document.startViewTransition();
  await authClient.signOut();
  return redirect(href("/login"));
}

export function SignOutButton() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action={href("/resources/signout")} className="w-full">
      <Button variant="secondary" type="submit" className="w-full">
        {fetcher.state !== "idle"
          ? <LoaderCircleIcon className="animate-spin" />
          : <LogOutIcon />}
        <span>Sign Out</span>
      </Button>
    </fetcher.Form>
  );
}
