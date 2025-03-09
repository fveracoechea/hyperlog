import { Form, redirect, useNavigation } from 'react-router';

import { cookies } from '@/.server/cookies';
import { authClient } from '@/lib/authClient.client';
import { LoginSchema } from '@/lib/zod';
import clsx from 'clsx';
import { LoaderCircleIcon, LogIn, Unlink } from 'lucide-react';

import { FormField } from '@/components/FormField';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

import type { Route } from './+types/Login';

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const validation = await LoginSchema.safeParseAsync(Object.fromEntries(formData));
  if (validation.error) return { formErrors: validation.error?.formErrors.fieldErrors };

  const { error } = await authClient.signIn.email(validation.data);
  if (!error) return redirect('/');

  return { message: error.message };
}

export async function loader({ request }: Route.LoaderArgs) {
  const info = await cookies.info.get(request);
  return { info };
}

export default function Login({ actionData, loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const errors = actionData?.formErrors;
  const message = actionData?.message;
  return (
    <main
      className={clsx(
        'flex min-h-svh flex-col items-center justify-center gap-8 px-6 py-10',
        'from-cpt-crust to-cpt-base bg-gradient-to-b',
      )}
    >
      <div className="flex gap-2">
        <Unlink width="36" height="36" className="text-primary" />
        <Typography as="h1" variant="title" className="text-4xl">
          Hyperlog
        </Typography>
      </div>
      <Card className="w-full max-w-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn width="24" height="24" />
            <Typography as="h2" variant="lead" className="text-2xl">
              Log In
            </Typography>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="POST" className="flex flex-col gap-4" noValidate>
            {loaderData.info && <Alert variant="info">{loaderData.info.message}</Alert>}
            <FormField
              label="Email"
              name="email"
              type="email"
              required
              errorMessage={errors?.email?.at(0)}
            />
            <FormField
              label="Password"
              type="password"
              name="password"
              required
              errorMessage={errors?.password?.at(0)}
            />
            {message && navigation.state === 'idle' && (
              <Alert variant="destructive">{message}</Alert>
            )}
            <Button className="mt-1">
              {navigation.state === 'submitting' ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                'Log In'
              )}
            </Button>
          </Form>
        </CardContent>
        <CardFooter>
          <Typography
            as="link"
            to="/sign-up"
            variant="small"
            muted
            className="w-full text-center"
          >
            Don&apos;t have an account? sign-up here.
          </Typography>
        </CardFooter>
      </Card>
    </main>
  );
}
