import type { ReactNode } from "react";
import { useFetcher } from "react-router";

import { LoaderCircleIcon } from "lucide-react";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Typography } from "./ui/typography";

type Props = {
  trigger: ReactNode;
  link: {
    id: string;
    title: string;
    url: string;
    favicon: string | null;
  };
};

export function DeleteLinkDialog(props: Props) {
  const {
    link: { title, url },
    trigger,
  } = props;

  const fetcher = useFetcher();

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
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
          <fetcher.Form method="post">
            {fetcher.state === "submitting" && (
              <div className="text-cpt-red flex h-10 w-20 items-center justify-center">
                <LoaderCircleIcon className="h-6 w-6 animate-spin" />
              </div>
            )}
            {fetcher.state === "idle" && (
              <Button
                variant="destructive"
                type="submit"
                name="intent"
                value="delete"
                className="w-24"
              >
                Yes, Delete
              </Button>
            )}
          </fetcher.Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
