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

type Props = {
  trigger: ReactNode;
  tag: {
    id: string;
    name: string;
    description?: string | null;
  };
};

export function DeleteTagDialog(props: Props) {
  const { tag, trigger } = props;

  const navigation = useNavigation();

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Collection</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this tag?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <Typography variant="large">{tag.name}</Typography>
          {tag.description && <Typography variant="small">{tag.description}</Typography>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
          <Form method="DELETE" replace>
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
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
