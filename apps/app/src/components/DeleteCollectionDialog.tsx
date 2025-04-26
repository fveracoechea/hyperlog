import type { ReactNode } from 'react';
import { useFetcher } from 'react-router';

import { LoaderCircleIcon } from 'lucide-react';

import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Typography } from './ui/typography';

type Props = {
  trigger: ReactNode;
  collection: {
    id: string;
    name: string;
    description?: string | null;
  };
};

export function DeleteCollectionDialog(props: Props) {
  const { collection, trigger } = props;

  const fetcher = useFetcher();

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Collection</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this collection?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <Typography>{collection.name}</Typography>
          {collection.description && (
            <Typography variant="small">{collection.description}</Typography>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
          <fetcher.Form method="DELETE">
            {fetcher.state === 'submitting' && (
              <div className="text-cpt-red flex h-10 w-20 items-center justify-center">
                <LoaderCircleIcon className="h-6 w-6 animate-spin" />
              </div>
            )}
            {fetcher.state === 'idle' && (
              <Button variant="destructive" type="submit" className="w-24">
                Yes, Delete
              </Button>
            )}
          </fetcher.Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
