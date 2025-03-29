import { useParams } from 'react-router';

import { PlusIcon } from 'lucide-react';

import { CreateCollectionForm } from './CreateCollectionForm';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export function AddSubCollectionDialog() {
  const { collectionId } = useParams();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <PlusIcon />
          <span>Add Sub-Collection</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Sub-Collections</DialogTitle>
          <DialogDescription>Create nested groups within a collection</DialogDescription>
        </DialogHeader>
        <CreateCollectionForm parentId={collectionId} />
      </DialogContent>
    </Dialog>
  );
}
