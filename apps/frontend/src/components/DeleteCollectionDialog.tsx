import { type ReactNode } from "react";
import { Form, useNavigation } from "react-router";

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
import { Checkbox } from "./ui/checkbox.tsx";

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

  const navigation = useNavigation();

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <Form method="DELETE" replace className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this collection?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col py-2">
            <Typography variant="large">{collection.name}</Typography>
            {collection.description && <Typography muted>{collection.description}</Typography>}
            <Typography
              as="label"
              className="flex items-end gap-2 justify-start mt-6 select-none"
            >
              <Checkbox name="delete" />
              <span className="leading-none">Delete all links in this collection.</span>
            </Typography>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Close
              </Button>
            </DialogClose>
            {navigation.state === "submitting" && (
              <div className="text-cpt-red flex h-10 w-20 items-center justify-center">
                <LoaderCircleIcon className="h-6 w-6 animate-spin" />
              </div>
            )}
            {navigation.state === "idle" && (
              <DialogClose asChild>
                <Button variant="destructive" type="submit" className="w-24">
                  Yes, Delete
                </Button>
              </DialogClose>
            )}
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
