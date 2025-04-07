import { Controller } from 'react-hook-form';
import { useFetcher } from 'react-router';

import { CreateLinkSchema } from '@/lib/zod';
import type { CollectionApiData } from '@/routes/api/collections';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleXIcon, FolderIcon, LoaderCircleIcon, PlusIcon } from 'lucide-react';
import { useRemixForm } from 'remix-hook-form';

import { CollectionIcon } from './CollectionIcon';
import { FormField } from './FormField';
import { Button } from './ui/button';
import { DialogClose, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Typography } from './ui/typography';

const resolver = zodResolver(CreateLinkSchema);

export function CreateLinkForm(props: { open: boolean }) {
  const { open } = props;
  const link = useFetcher();
  const collections = useFetcher<CollectionApiData>();

  const { register, control, handleSubmit, setValue, getValues, formState } = useRemixForm({
    fetcher: link,
    resolver,
  });

  // Fetch data only when the modal opens
  if (open && collections.state === 'idle' && !collections.data) {
    collections.load('/api/collections?allowSubCollections');
  }

  const errors = formState.errors;

  return (
    <link.Form
      noValidate
      method="post"
      action="/api/link"
      onSubmit={data => {
        const url = getValues('url');
        if (!/^https?:\/\//.test(String(url))) {
          setValue('url', `https://${url}`);
        }
        handleSubmit(data);
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-4">
        <FormField
          label="URL"
          placeholder="https://example.com"
          required
          {...register('url')}
          errorMessage={errors.url?.message}
        />
        <FormField
          label="Title"
          placeholder="Auto-generated if left blank"
          {...register('title')}
          errorMessage={errors.title?.message}
        />
        <div className="flex flex-col gap-1">
          <Typography as="label" htmlFor="tag-select">
            Collection
          </Typography>
          <Controller
            control={control}
            name="collectionId"
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
                        <CollectionIcon size="small" color={collection.color ?? undefined} />
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
          label="Notes"
          className="resize-none"
          placeholder="Relevant details or thoughts"
          {...register('notes')}
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
            Create Link
          </Button>
        )}
      </DialogFooter>
    </link.Form>
  );
}
