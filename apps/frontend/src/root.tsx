import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Unlink } from "lucide-react";
import { Typography } from "./components/ui/typography.tsx";
import clsx from "clsx";

export const links: Route.LinksFunction = () => [
  {
    rel: "stylesheet",
    href: stylesheet,
  },
];

export function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script src="/load-theme.js" />
        {import.meta.env.DEV && (
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        )}
      </head>
      <ThemeProvider defaultTheme="system">
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </ThemeProvider>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <main
      className={clsx(
        "flex min-h-svh flex-col items-center justify-center gap-6 px-6 py-10",
        "from-cpt-crust to-cpt-base bg-gradient-to-b",
      )}
    >
      <div className="flex flex-col gap-2 justify-center items-center pb-4">
        <Unlink className="text-primary w-16 h-16" />
        <Typography as="h1" variant="title" className="text-4xl">
          Hyperlog
        </Typography>
      </div>
      <div className="loader max-w-sm" />
      <Typography muted variant="small">loading your experience</Typography>
    </main>
  );
}

export default function App({}: Route.ComponentProps) {
  return <Outlet />;
}
