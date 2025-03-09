import { Form, redirect, useNavigation } from 'react-router';

import { authClient } from '@/lib/authClient.client';
import { SignupSchema } from '@/lib/zod';
import clsx from 'clsx';
import { LoaderCircleIcon, Unlink, UserRoundPlus } from 'lucide-react';

import { FormField } from '@/components/FormField';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

import type { Route } from './+types/SignUp';

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const validation = await SignupSchema.safeParseAsync(Object.fromEntries(formData));
  if (validation.error) return { formErrors: validation.error?.formErrors.fieldErrors };

  const { error } = await authClient.signUp.email(validation.data);
  if (!error) return redirect('/');

  return { message: error.message };
}

export default function SignUp({ actionData }: Route.ComponentProps) {
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
            <UserRoundPlus width="24" height="24" />
            <Typography as="h2" variant="lead" className="text-2xl">
              Sign Up
            </Typography>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="POST" noValidate className="flex flex-col gap-4">
            <FormField label="Name" name="name" required errorMessage={errors?.name?.at(0)} />
            <FormField
              label="Email"
              type="email"
              name="email"
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
            <FormField
              label="Confirm Password"
              type="password"
              required
              name="verifyPassword"
              errorMessage={errors?.verifyPassword?.at(0)}
            />

            {navigation.state === 'idle' && message && (
              <Alert variant="destructive">{message}</Alert>
            )}

            <Button className="mt-1">
              {navigation.state === 'loading' ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                'Sign Up'
              )}
            </Button>
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
