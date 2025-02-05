import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  isRouteErrorResponse,
  redirect,
} from 'react-router';

import type { Route } from './+types/root';
import stylesheet from './app.css?url';
import { cookies } from './utility/cookies';
import { env } from './utility/env';
import { api, getSession } from './utility/hono';

export const links: Route.LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: stylesheet,
  },
];

const authRoutes = ['/login', '/sign-up'];

export async function loader({ request }: Route.LoaderArgs) {
  const { pathname } = new URL(request.url);
  const response = await api.user.whoami.$get({ json: {} }, getSession(request));
  const json = await response.json();

  const isAuthRoute = authRoutes.includes(pathname);

  if ((!response.ok || !json.success) && !isAuthRoute) {
    // Types not being inferred because there is no error response in this endpoint
    // However the sessionMiddleware can respond with this format
    const error = json.error as unknown as { message: string };
    const headers = new Headers();
    headers.append('Set-Cookie', await cookies.info.set({ ...error, type: 'info' }));
    throw redirect('/login', { headers });
  } else if (isAuthRoute && response.ok) {
    throw redirect('/', { headers: response.headers });
  }

  return data(json.data, { headers: response.headers });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {env.isDev && <script src="https://unpkg.com/react-scan/dist/auto.global.js" />}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
