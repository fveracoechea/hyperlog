import { Links, Meta, Outlet, Scripts, ScrollRestoration, href } from 'react-router';

import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes';

import type { Route } from './+types/root';
import { themeSessionResolver } from './.server/cookies';
import stylesheet from './app.css?url';

export const links: Route.LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: stylesheet,
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return { theme: getTheme() };
}

function Document(props: { children: React.ReactNode; ssrTheme: boolean }) {
  const { children, ssrTheme } = props;
  const [theme] = useTheme();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <PreventFlashOnWrongTheme ssrTheme={ssrTheme} />
        {import.meta.env.DEV && (
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        )}
      </head>
      <body className={theme === 'dark' ? 'dark' : 'light'}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData: { theme } }: Route.ComponentProps) {
  return (
    <ThemeProvider
      specifiedTheme={theme}
      themeAction={href('/api/theme')}
      disableTransitionOnThemeChange
    >
      <Document ssrTheme={Boolean(theme)}>
        <Outlet />
      </Document>
    </ThemeProvider>
  );
}
