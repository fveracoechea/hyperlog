import { Route } from "../../.react-router/types/src/routes/+types/AccountPage.ts";
import { PageErrorBoundary } from "@/components/PageErrorBoundary.tsx";

export const ErrorBoundary = PageErrorBoundary;

export function clientLoader({}: Route.ClientLoaderArgs) {
  return null;
}

export default function AccountPage({}: Route.ComponentProps) {
  return <div>Account Page</div>;
}
