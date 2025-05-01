import { data, redirect } from 'react-router';

import { auth } from './auth';
import { cookies } from './cookies';

const authRoutes = ['/login', '/sign-up'];

export async function getSessionOrRedirect(request: Request) {
  const { pathname } = new URL(request.url);
  const isAuthRoute = authRoutes.includes(pathname);

  const response = await auth.api.getSession({ headers: request.headers, asResponse: true });
  const json = await (response.json() as ReturnType<typeof auth.api.getSession>);
  const headers = new Headers(response.headers);

  if (json) return { headers, data: json };

  if (!isAuthRoute) {
    headers.append(
      'Set-Cookie',
      await cookies.info.serialize({
        type: 'info',
        message: 'You must be logged in to access this resource. Please login to continue.',
      }),
    );

    throw redirect('/login', { headers });
  }

  if (isAuthRoute) {
    throw redirect('/', { headers });
  }

  throw data('Session Not found', { status: 404, headers });
}
