import { isRouteErrorResponse, Link } from "react-router";

import { Link2OffIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Typography } from "./ui/typography";

export function PageErrorBoundary({ error }: { error: unknown }) {
  let stack: string | undefined;
  let headline = "We ran into an unexpected issue";
  let message =
    "We apologize for the inconvenience. Please try again later. If the issue persists, contact support.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      headline = "Page Not Found";
      message =
        "We couldn’t find what you were looking for. It might have moved or doesn’t exist";
    }
    if (error.status === 403) {
      headline = "Oops! You don’t have access.";
      message = "It looks like you don’t have permission to access this resource";
    }
  }

  if (import.meta.env.DEV && error instanceof Error) {
    stack = error.stack;
  }

  return (
    <section className="mx-auto flex flex-1 items-center pb-10">
      <div className="flex flex-col items-center gap-4">
        <Link2OffIcon className="stroke-cpt-surface1 h-24 w-24" />
        <div className="flex max-w-screen-sm flex-col justify-center gap-0 text-center">
          <Typography variant="large">{headline}</Typography>
          <Typography muted>{message}</Typography>
        </div>
        <Button asChild>
          <Link to="/" replace>
            Go to Homepage
          </Link>
        </Button>

        {stack && (
          <div className="border-border max-w-full rounded-md border p-2 text-sm">
            <pre className="max-w-screen-2xl overflow-x-auto p-4">
              <code>{stack}</code>
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
