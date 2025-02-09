import { Outlet, redirect } from 'react-router';

import { api, getSession } from '@/utils/hono';

export async function loader({ request }: Route.LoaderArgs) {
  const response = await api.user.whoami.$get({}, getSession(request));
  const json = await response.json();

  if (response.ok && json.success) {
    return redirect('/', { headers: response.headers });
  }
  return null;
}

export default function PublicLayout() {
  return <Outlet />;
}
