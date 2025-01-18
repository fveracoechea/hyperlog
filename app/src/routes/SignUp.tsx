import { Form, redirect } from 'react-router';

import { api, getSession } from '@/utility/hono';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema, type SignupSchemaType } from '@hyperlog/shared';
import clsx from 'clsx';
import { AlertCircle, Unlink, UserRoundPlus } from 'lucide-react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';

import { FormField } from '@/components/FormField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

import type { Route } from './+types/SignUp';

const resolver = zodResolver(SignupSchema);

export async function action({ request }: Route.ActionArgs) {
  const form = await getValidatedFormData<SignupSchemaType>(request, resolver);
  if (form.errors) return { errors: form.errors, defaultValues: form.receivedValues };

  const response = await api.auth['sign-up'].$post({ json: form.data }, getSession(request));

  const json = await response.json();
  if (!json.success) return json.error.message;

  return redirect('/', { headers: response.headers });
}

export default function SignUp({ actionData }: Route.ComponentProps) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useRemixForm<SignupSchemaType>({ resolver });

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
            <UserRoundPlus width="24" height="24" />
            <Typography as="h2" variant="lead" className="text-2xl">
              Sign Up
            </Typography>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            method="POST"
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <FormField
              label="Email"
              type="email"
              required
              {...register('email')}
              errorMessage={errors.email?.message}
            />
            <FormField
              label="First Name"
              required
              {...register('firstName')}
              errorMessage={errors.firstName?.message}
            />
            <FormField
              label="Last Name"
              {...register('lastName')}
              errorMessage={errors.lastName?.message}
            />
            <FormField
              label="Password"
              type="password"
              required
              {...register('password')}
              errorMessage={errors.password?.message}
            />
            <FormField
              label="Confirm Password"
              type="password"
              required
              {...register('verifyPassword')}
              errorMessage={errors.verifyPassword?.message}
            />
            {actionData && typeof actionData === 'string' && (
              <Alert variant="destructive">{actionData}</Alert>
            )}
            <Button className="mt-1">{isSubmitting ? 'Loading...' : 'Sign Up'}</Button>
          </Form>
        </CardContent>
        <CardFooter>
          <Typography
            as="link"
            to="/login"
            variant="small"
            muted
            className="w-full text-center"
          >
            Already have an account? log-in here.
          </Typography>
        </CardFooter>
      </Card>
    </main>
  );
}
