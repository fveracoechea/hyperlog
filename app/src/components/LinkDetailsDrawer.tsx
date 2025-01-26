import { Suspense, useMemo } from 'react';
import { Await, useLoaderData, useRouteLoaderData, useSearchParams } from 'react-router';

import { fetchLinkResource } from '@/routes/resource/link';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import type { Route } from '../routes/+types/Layout';
import { Typography } from './ui/typography';

export function LinkDetailsDrawer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const linkId = searchParams.get('link');

  const promise = useMemo(() => fetchLinkResource(searchParams), [searchParams]);

  return (
    <Drawer
      open={Boolean(linkId)}
      onOpenChange={() => {
        searchParams.delete('link');
        setSearchParams(searchParams, { preventScrollReset: true });
      }}
    >
      <DrawerContent>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={promise}>
            {result => {
              const link = result?.data?.link;

              return link ? (
                <div className="w-full">
                  <DrawerHeader>
                    <DrawerTitle>{link.title}</DrawerTitle>
                    <DrawerDescription>{link.description}</DrawerDescription>
                  </DrawerHeader>
                  <DrawerBody>
                    <Typography variant="lead">Link details</Typography>
                  </DrawerBody>
                  <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              ) : (
                <div className="w-full">
                  <DrawerHeader>
                    <DrawerTitle>Link Not Found</DrawerTitle>
                    <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              );
            }}
          </Await>
        </Suspense>
      </DrawerContent>
    </Drawer>
  );
}
