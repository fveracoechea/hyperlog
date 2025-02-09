import { isRouteErrorResponse, redirect } from 'react-router';

import { APIError } from 'better-auth/api';

import { auth } from './auth';
import { cookies } from './cookies';

const authRoutes = ['/login', '/sign-up'];

export async function getSessionOrRedirect(request: Request) {
  const { pathname } = new URL(request.url);
  const isAuthRoute = authRoutes.includes(pathname);
  try {
    const headers = new Headers();
    const data = await auth.api.getSession({ headers: request.headers });

    if (!data && !isAuthRoute) {
      headers.append(
        'Set-Cookie',
        await cookies.info.set({
          message: 'You must be logged in to access this resource. Please login to continue.',
          type: 'info',
        }),
      );

      throw redirect('/login', { headers });
    } else if (data && isAuthRoute) {
      throw redirect('/', { headers });
    }

    return data!;
  } catch (error) {
    let headers = new Headers();
    if (isRouteErrorResponse(error)) throw error;
    if (error instanceof APIError) headers = error.headers;
    if (error instanceof Error)
      headers.append(
        'Set-Cookie',
        await cookies.info.set({ message: error.message, type: 'destructive' }),
      );

    if (!isAuthRoute) throw redirect('/login', { headers });

    // Should only be reached in auth-routes (login, sign-up)
    return null as never;
  }
}
