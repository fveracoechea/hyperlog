import { type PropsWithChildren, useEffect } from 'react';
import { useFetcher, useSearchParams } from 'react-router';

import {
  FolderIcon,
  LibraryIcon,
  Link2OffIcon,
  LinkIcon,
  type LucideProps,
  TagIcon,
} from 'lucide-react';

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

import type { Route } from '../routes/resource/+types/link';
import { Typography } from './ui/typography';

type Props = PropsWithChildren<{
  title: string;
  Icon?: React.FunctionComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;
}>;

function LineItem(props: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <Typography muted>{props.title}</Typography>
      </div>
      <div className="px-4 py-2 bg-cpt-base border border-border rounded-lg flex gap-2 justify-between items-center">
        {props.children}
        {props.Icon && <props.Icon className="h-5 w-5 stroke-muted-foreground" />}
      </div>
    </div>
  );
}

let old: string | null = null;

export function LinkDetailsDrawer() {
  const fetcher = useFetcher<Route.ComponentProps['loaderData']>();
  const link = fetcher.data;

  const [searchParams, setSearchParams] = useSearchParams();
  const linkId = searchParams.get('link');

  if (linkId !== old) {
    old = linkId;
    if (linkId) fetcher.load(`/resource/link/${linkId}`);
  }

  return (
    <Drawer
      open={Boolean(linkId)}
      onOpenChange={() => {
        searchParams.delete('link');
        setSearchParams(searchParams, { preventScrollReset: true });
      }}
    >
      <DrawerContent>
        {fetcher.state === 'loading' && (
          <div className="w-full animate-pulse">
            <DrawerHeader>
              <DrawerTitle className="sr-only">Loading</DrawerTitle>
              <DrawerDescription className="sr-only">Fetching link data</DrawerDescription>
              <div className="flex flex-col gap-4 pt-2">
                <div aria-busy="true" className="h-6 w-8/12 bg-cpt-surface0 rounded" />
                <div className="flex flex-col gap-2">
                  <div aria-busy="true" className="h-4 w-10/12 bg-cpt-surface0 rounded" />
                </div>
              </div>
            </DrawerHeader>
            <DrawerFooter className="justify-self-end">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        )}

        {fetcher.state === 'idle' && link && (
          <div className="w-full h-full flex flex-col">
            <DrawerHeader>
              <DrawerTitle>{link.title}</DrawerTitle>
              <DrawerDescription>{link.description}</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="flex flex-col gap-4">
              <LineItem title="Link" Icon={LinkIcon}>
                <Typography as="a" className="font-light" link href={link.url}>
                  {link.url}
                </Typography>
              </LineItem>
              <LineItem title="Tag" Icon={TagIcon}>
                {link.tag ? (
                  <Typography as="link" className="font-light" to={`/tags/${link.tagId}`}>
                    {link.tag?.name}
                  </Typography>
                ) : (
                  <Typography muted className="font-light">
                    No tag
                  </Typography>
                )}
              </LineItem>
              <LineItem title="Collection" Icon={FolderIcon}>
                {link.collection ? (
                  <Typography
                    as="link"
                    className="font-light"
                    to={`/collections/${link.collectionId}`}
                  >
                    {link.collection?.name}
                  </Typography>
                ) : (
                  <Typography muted className="font-light">
                    No collection
                  </Typography>
                )}
              </LineItem>
            </DrawerBody>
            <DrawerFooter className="justify-self-end">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        )}

        {fetcher.state === 'idle' && fetcher.data === null && (
          <div className="w-full h-full flex flex-col">
            <DrawerHeader>
              <DrawerTitle>Link Not Found</DrawerTitle>
              <DrawerDescription className="sr-only">Link Not Found.</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="flex items-center justify-center flex-1">
              <Link2OffIcon className="h-24 w-24 stroke-cpt-surface2" />
            </DrawerBody>
            <DrawerFooter className="justify-self-end">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
