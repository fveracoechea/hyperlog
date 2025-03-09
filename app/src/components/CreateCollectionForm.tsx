import { Controller } from 'react-hook-form';
import { useFetcher } from 'react-router';

import { CreateCollectionSchema } from '@/lib/zod';
import type { CollectionApiData } from '@/routes/api/collections';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleXIcon, FolderIcon, LoaderCircleIcon, PlusIcon } from 'lucide-react';
import { useRemixForm } from 'remix-hook-form';

import { FormField } from './FormField';
import { Button } from './ui/button';
import { DialogClose, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Typography } from './ui/typography';

const resolver = zodResolver(CreateCollectionSchema);

export function CreateCollectionForm(props: { open: boolean }) {
  const { open } = props;
  const fetcher = useFetcher();
  const collections = useFetcher<CollectionApiData>();

  const { register, control, handleSubmit, formState } = useRemixForm({
    fetcher,
    resolver,
  });

  // Fetch data only when the modal opens
  if (open && collections.state === 'idle' && !collections.data) {
    collections.load('/api/collections');
  }

  const errors = formState.errors;

  return (
    <fetcher.Form
      noValidate
      method="post"
      action="/api/link"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-4">
        <Typography muted>TODO: color picker</Typography>

        <FormField
          label="Name"
          required
          placeholder="e.g. Recipes"
          {...register('name')}
          errorMessage={errors.name?.message}
        />

        <div className="flex flex-col gap-1">
          <Typography as="label" htmlFor="tag-select">
            Parent Collection
          </Typography>
          <Controller
            control={control}
            name="parentId"
            render={({ field: { value, name, onChange, ...selectProps } }) => (
              <Select
                key={value}
                name={name}
                value={value ?? undefined}
                onValueChange={selected => {
                  if (selected === 'NO-COLLECTION') onChange('');
                  else onChange(selected);
                }}
              >
                <SelectTrigger {...selectProps}>
                  <SelectValue placeholder="No collection" />
                </SelectTrigger>
                <SelectContent>
                  {value && (
                    <SelectItem value="NO-COLLECTION">
                      <div className="flex items-center gap-2">
                        <CircleXIcon className="h-5 w-5" />
                        <Typography>No Collection</Typography>
                      </div>
                    </SelectItem>
                  )}
                  {collections.data?.collections.map(collection => (
                    <SelectItem key={collection.id} value={collection.id}>
                      <div className="flex items-center gap-2">
                        <FolderIcon
                          className="h-5 w-5"
                          style={{
                            stroke: collection?.color ?? undefined,
                            fill: collection?.color ?? undefined,
                          }}
                        />
                        <Typography>{collection.name}</Typography>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <FormField
          variant="textarea"
          label="Description"
          className="resize-none"
          placeholder="The purpose of this collection..."
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
          <Button disabled type="button" className="min-w-24">
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
