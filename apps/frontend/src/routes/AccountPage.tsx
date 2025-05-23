import { Route } from "../../.react-router/types/src/routes/+types/AccountPage.ts";
import { PageErrorBoundary } from "@/components/PageErrorBoundary.tsx";
import { SubBanner } from "../components/Banner.tsx";
import { ImportIcon, SkullIcon } from "lucide-react";

export const ErrorBoundary = PageErrorBoundary;

export function clientLoader({}: Route.ClientLoaderArgs) {
  return null;
}

export default function AccountPage({}: Route.ComponentProps) {
  return (
    <>
      <div>
        <SubBanner
          Icon={ImportIcon}
          title="Import Bookmarks"
          subtitle="Import your links and bookmarks from other browsers."
        />
      </div>

      <div>
        <SubBanner
          Icon={SkullIcon}
          title="Danger Zone"
          subtitle="This will permanently delete your account all associated data."
        />
      </div>
    </>
  );
}
