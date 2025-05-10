import { type ReactNode, useState } from "react";

import { CreateCollectionForm } from "./CreateCollectionForm";
import { CreateLinkForm } from "./CreateLinkForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type Props = {
  trigger: ReactNode;
  tab?: "link" | "collection" | "tag";
};

export function CreateNewDialog(props: Props) {
  const { trigger, tab = "link" } = props;
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New</DialogTitle>
          <DialogDescription>
            Use this dialog to add a new link, collection, or tag
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={tab} className="flex flex-col gap-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="tag">Tag</TabsTrigger>
          </TabsList>
          <TabsContent value="link">
            <CreateLinkForm onComplete={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="collection">
            <CreateCollectionForm />
          </TabsContent>
          <TabsContent value="tag">new tag</TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
