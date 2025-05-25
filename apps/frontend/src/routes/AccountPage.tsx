import { Route } from "../../.react-router/types/src/routes/+types/AccountPage.ts";
import { PageErrorBoundary } from "@/components/PageErrorBoundary.tsx";
import { SubBanner } from "../components/Banner.tsx";
import { RocketIcon, TriangleAlertIcon } from "lucide-react";
import { Button } from "../components/ui/button.tsx";
import { Typography } from "../components/ui/typography.tsx";
import { ImportBookmarks } from "./resources/importBookmarks.tsx";

export const ErrorBoundary = PageErrorBoundary;

export function clientLoader({}: Route.ClientLoaderArgs) {
  return null;
}

export default function AccountPage({}: Route.ComponentProps) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <SubBanner
          Icon={RocketIcon}
          title="My Subscription"
          subtitle="Your current plan and billing information."
        />
        <Typography muted>
          lorem ipsum dolor sit amet, consectetur adipiscing elit
          <Typography className="text-foreground" variant="title">
            &nbsp;$7.99/<span className="text-base">month</span>
          </Typography>
        </Typography>
        <Typography muted>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates ipsam quibusdam
          dolorem hic eveniet nesciunt labore itaque et perspiciatis, assumenda aliquid cum
          ipsum? Eius voluptates ea non, alias libero optio!
        </Typography>
        <div className="flex gap-4 justify-end">
          <Button variant="outline" className="w-fit">Cancel Subscription</Button>
          <Button className="w-fit">Upgrade to Pro</Button>
        </div>
      </div>

      <ImportBookmarks />

      <hr />

      <div className="flex flex-col gap-4">
        <SubBanner
          variant="destructive"
          Icon={TriangleAlertIcon}
          title="Danger Zone"
          subtitle="Please proceed with caution. Once deleted, your data cannot be recovered."
        />
        <Typography>
          Permanently delete your account and all associated data, including saved links,
          collections, and tags. This action is irreversible. If you're sure you want to
          continue, click the button below.
        </Typography>
        <Button variant="outline" className="w-fit self-end">Delete Account</Button>
      </div>
    </>
  );
}
