import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import stylesheet from './app.css?url';

export const links: Route.LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: stylesheet,
  },
];

export function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        {import.meta.env.DEV && (
          <script src='https://unpkg.com/react-scan/dist/auto.global.js' />
        )}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return 'Loading...';
}

export default function App({}: Route.ComponentProps) {
  return <Outlet />;
}
