import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

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
  return "Loading...";
}

export default function App({}: Route.ComponentProps) {
  return <Outlet />;
}
