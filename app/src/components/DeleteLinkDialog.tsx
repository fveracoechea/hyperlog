import { useFetcher, useLocation } from 'react-router';

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
  link: {
    id: string;
    title: string;
    url: string;
    favicon: string | null;
  };
};

export function DeleteLinkDialog(props: Props) {
  const location = useLocation();

  const {
    link: { title, url, id },
  } = props;

  const fetcher = useFetcher();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>Are you sure you want to delete this link?</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <Typography>{title}</Typography>
          <Typography variant="small">{url}</Typography>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
          <fetcher.Form method="DELETE" action={`/resource/link/${id}`}>
            <input type="hidden" name="redirect" value={location.pathname} />
            {fetcher.state === 'submitting' && (
              <div className="text-cpt-red flex h-10 w-20 items-center justify-center">
                <LoaderCircleIcon className="h-6 w-6 animate-spin" />
              </div>
            )}
            {fetcher.state === 'idle' && (
              <Button variant="destructive" type="submit" className="w-20">
                Delete
              </Button>
            )}
          </fetcher.Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
