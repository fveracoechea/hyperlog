import { Controller } from 'react-hook-form';
import { useFetcher } from 'react-router';

import { CreateCollectionSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon, PlusIcon } from 'lucide-react';
import { useRemixForm } from 'remix-hook-form';

import { ColorPicker } from './ColorPicker';
import { FormField } from './FormField';
import { Button } from './ui/button';
import { DialogClose, DialogFooter } from './ui/dialog';

const resolver = zodResolver(CreateCollectionSchema);

export function CreateCollectionForm(props: { parentId?: string }) {
  const { parentId } = props;
  const fetcher = useFetcher();
  const { register, control, handleSubmit, formState } = useRemixForm({
    fetcher,
    resolver,
    submitData: { parentId },
  });

  return (
    <fetcher.Form
      action="/api/collections"
      method="POST"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-4">
        <FormField
          label="Name"
          required
          placeholder="e.g. Recipes"
          {...register('name')}
          errorMessage={formState.errors.name?.message}
        />
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <ColorPicker onColorChange={value => field.onChange(value.at(1))} />
          )}
        />
        <FormField
          variant="textarea"
          label="Description"
          className="resize-none"
          placeholder="The purpose of this collection"
          {...register('description')}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="ghost">
            Close
          </Button>
        </DialogClose>

        {formState.isSubmitting ? (
          <Button disabled type="button" className="min-w-28">
            <LoaderCircleIcon className="min-h-5 min-w-5 animate-spin" />
          </Button>
        ) : (
          <Button type="submit">
            <PlusIcon />
            Create Collection
          </Button>
        )}
      </DialogFooter>
    </fetcher.Form>
  );
}
