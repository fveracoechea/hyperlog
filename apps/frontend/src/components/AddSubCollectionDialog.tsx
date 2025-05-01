import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { type CreateCollectionFormFields, CreateCollectionSchema } from '@/lib/zod';
import type { SubCollectionItem } from '@/routes/CollectionEdit';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon, PlusIcon } from 'lucide-react';

import { ColorPicker } from './ColorPicker';
import { FormField } from './FormField';
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

type Props = {
  subCollections: SubCollectionItem[];
  onSubmit(value: CreateCollectionFormFields): void;
};

const resolver = zodResolver(CreateCollectionSchema);

export function AddSubCollectionDialog(props: Props) {
  const { onSubmit, subCollections } = props;
  const [open, setOpen] = useState(false);
  const { handleSubmit, register, formState, control, reset, setError } = useForm({
    resolver,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' type='button'>
          <PlusIcon />
          <span>Add Sub-Collection</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Sub-Collections</DialogTitle>
          <DialogDescription>Create nested groups within a collection</DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleSubmit((fields) => {
              if (subCollections.some((s) => s.name === fields.name)) {
                setError('name', {
                  type: 'value',
                  message: 'Sub-Collection name is already in use. Try a different one.',
                });
                return;
              }
              onSubmit(fields);
              reset();
              setOpen(false);
            })(event);
          }}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col gap-4'>
            <FormField
              label='Name'
              required
              placeholder='e.g. Recipes'
              {...register('name')}
              errorMessage={formState.errors.name?.message}
            />

            <Controller
              control={control}
              name='color'
              render={({ field }) => {
                return <ColorPicker {...field} value={field.value ?? undefined} />;
              }}
            />

            <FormField
              variant='textarea'
              label='Description'
              className='resize-none'
              placeholder='The purpose of this collection'
              {...register('description')}
              errorMessage={formState.errors.description?.message}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='ghost'>
                Close
              </Button>
            </DialogClose>

            {formState.isSubmitting
              ? (
                <Button disabled type='button' className='min-w-28'>
                  <LoaderCircleIcon className='min-h-5 min-w-5 animate-spin' />
                </Button>
              )
              : (
                <Button type='submit'>
                  <PlusIcon />
                  Create Collection
                </Button>
              )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
