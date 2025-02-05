import { type PropsWithChildren, useRef, useState } from 'react';
import { useFetcher, useSearchParams } from 'react-router';

import { formatDate } from 'date-fns';
import {
  DeleteIcon,
  FolderIcon,
  ImageIcon,
  Link2OffIcon,
  LinkIcon,
  type LucideProps,
  TagIcon,
  TrashIcon,
  XIcon,
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
      <div className="flex items-center gap-2">
        <Typography muted>{props.title}</Typography>
      </div>
      <div className="bg-cpt-base border-border flex items-center justify-between gap-2 rounded-lg border px-4 py-2">
        {props.children}
        {props.Icon && <props.Icon className="stroke-muted-foreground h-5 w-5" />}
      </div>
    </div>
  );
}

export function LinkDetailsDrawer() {
  const fetcher = useFetcher<Route.ComponentProps['loaderData']>();
  const link = fetcher.data;

  const [searchParams, setSearchParams] = useSearchParams();
  const [previusId, setPreviousId] = useState<string | null>(null);

  const linkId = searchParams.get('link');

  if (linkId && linkId !== previusId) {
    fetcher.load(`/resource/link/${linkId}`);
    setPreviousId(linkId);
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
          <div className="flex h-full w-full animate-pulse flex-col">
            <DrawerHeader className="relative">
              <DrawerClose asChild className="justify-self-start">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1"
                  title="Close drawer"
                >
                  <XIcon className="min-h-5 min-w-5" />
                </Button>
              </DrawerClose>
              <DrawerTitle className="sr-only">Loading</DrawerTitle>
              <DrawerDescription className="sr-only">Fetching link data</DrawerDescription>
              <div className="flex flex-col gap-4 pt-2">
                <div aria-busy="true" className="bg-cpt-surface0 h-6 w-8/12 rounded" />
                <div className="flex flex-col gap-2">
                  <div aria-busy="true" className="bg-cpt-surface0 h-4 w-10/12 rounded" />
                </div>
              </div>
            </DrawerHeader>
            <DrawerBody className="flex flex-col gap-10 pt-16">
              <div aria-busy="true" className="bg-cpt-surface0 h-10 w-full rounded" />
              <div aria-busy="true" className="bg-cpt-surface0 h-10 w-full rounded" />
              <div aria-busy="true" className="bg-cpt-surface0 h-10 w-full rounded" />
            </DrawerBody>
            <DrawerFooter className="justify-self-end">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        )}

        {fetcher.state === 'idle' && link && (
          <div className="flex h-full w-full flex-col">
            <DrawerHeader className="relative">
              <DrawerClose asChild className="justify-self-start">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1"
                  title="Close drawer"
                >
                  <XIcon className="min-h-5 min-w-5" />
                </Button>
              </DrawerClose>
              <DrawerTitle>{link.title}</DrawerTitle>
              <DrawerDescription>{link.description}</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="flex flex-col gap-6">
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
              {link.previewImage && (
                <div className="relative">
                  <img
                    src={link.previewImage}
                    height="630"
                    width="1200"
                    className="border-border bg-cpt-base aspect-[1.91/1] rounded border"
                  />
                  {link.favicon && (
                    <img
                      src={link.favicon}
                      width="40"
                      height="40"
                      alt="favicon"
                      className="border-border absolute left-2 top-2 rounded border-2"
                    />
                  )}
                </div>
              )}
              <Typography muted>
                Saved: {formatDate(link.createdAt ?? new Date(), 'PPPP')}
              </Typography>
            </DrawerBody>
            <DrawerFooter className="flex flex-row justify-between gap-4 justify-self-end">
              <DrawerClose asChild className="justify-self-start">
                <Button variant="ghost">
                  <span>Close</span>
                </Button>
              </DrawerClose>
              <div className="flex gap-4">
                <Button variant="outline">
                  <span>Delete</span>
                </Button>
                <Button variant="default">
                  <span>View Screenshot</span>
                </Button>
              </div>
            </DrawerFooter>
          </div>
        )}

        {fetcher.state === 'idle' && fetcher.data === null && (
          <div className="flex h-full w-full flex-col">
            <DrawerHeader>
              <DrawerTitle>Link Not Found</DrawerTitle>
              <DrawerDescription className="sr-only">Link Not Found.</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="flex flex-1 items-center justify-center">
              <Link2OffIcon className="stroke-cpt-surface2 h-24 w-24" />
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
