import { Form, redirect } from 'react-router';

import { api, getSession } from '@/utility/hono';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, type LoginSchemaType } from '@hyperlog/shared';
import clsx from 'clsx';
import { LogIn, Unlink } from 'lucide-react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';

import { FormField } from '@/components/FormField';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

import type { Route } from './+types/Login';

const resolver = zodResolver(LoginSchema);

export async function action({ request }: Route.ActionArgs) {
  const form = await getValidatedFormData<LoginSchemaType>(request, resolver);
  if (form.errors) return { errors: form.errors, defaultValues: form.receivedValues };

  const response = await api.auth.login.$post({ json: form.data }, getSession(request));

  const json = await response.json();
  if (!json.success) return json.error.message;

  const headers = new Headers(response.headers);
  return redirect('/', { headers });
}

export default function Login({ actionData }: Route.ComponentProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useRemixForm<LoginSchemaType>({
    resolver,
  });
  return (
    <main
      className={clsx(
        'flex flex-col gap-8 min-h-svh justify-center items-center py-10 px-6',
        'bg-gradient-to-b from-cpt-crust to-cpt-base',
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
          <CardTitle className="flex gap-2 items-center">
            <LogIn width="24" height="24" />
            <Typography as="h2" variant="lead" className="text-2xl">
              Log In
            </Typography>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <FormField
              label="Username or Email"
              required
              {...register('username')}
              errorMessage={errors.username?.message}
            />
            <FormField
              label="Password"
              required
              {...register('password')}
              errorMessage={errors.password?.message}
            />
            {actionData && typeof actionData === 'string' && (
              <Alert variant="destructive">{actionData}</Alert>
            )}
            <Button className="mt-1">{isSubmitting ? 'Loading...' : 'Log In'}</Button>
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
