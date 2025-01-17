import { Form } from 'react-router';

import clsx from 'clsx';
import { LogIn, Unlink } from 'lucide-react';

import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

import type { Route } from './+types/Login';

export async function action({}: Route.ActionArgs) {
  return null;
}

export default function Login() {
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
          <Form className="flex flex-col gap-4" noValidate>
            <FormField label="Username or Email" required />
            <FormField label="Password" required />
            <Button className="mt-1">Log In</Button>
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
