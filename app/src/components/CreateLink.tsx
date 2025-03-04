import { type ReactNode } from 'react';
import type { FieldErrors } from 'react-hook-form';
import { useFetcher } from 'react-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { type CreateLinkFormFields, CreateLinkSchema } from '@hyperlog/shared';
import { LoaderCircleIcon, PlusIcon } from 'lucide-react';
import { useRemixForm } from 'remix-hook-form';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const resolver = zodResolver(CreateLinkSchema);

export function CreateLinkForm() {
  const fetcher = useFetcher<{ errors: FieldErrors<CreateLinkFormFields> }>();
  const form = useRemixForm<CreateLinkFormFields>({
    resolver,
    fetcher,
    submitConfig: {
      method: 'POST',
      action: '/api/link',
    },
  });

  const errors = form.formState.errors;

  return (
    <fetcher.Form
      method="POST"
      action="/api/link"
      onSubmit={event => {
        const url = form.getValues('url');
        if (!/^https?:\/\//.test(url)) {
          form.setValue('url', `https://${url}`);
        }

        return form.handleSubmit(event);
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="URL"
          fieldClassName="col-span-2"
          placeholder="https://example.com"
          required
          {...form.register('url')}
          errorMessage={errors.url?.message}
        />
        <FormField
          label="Title"
          placeholder="Auto-generated if left blank"
          fieldClassName="col-span-2"
          {...form.register('title')}
          errorMessage={errors.title?.message}
        />
        <FormField
          variant="textarea"
          label="Notes"
          className="resize-none"
          placeholder="Relevant details or thoughts"
          fieldClassName="col-span-2"
          {...form.register('notes')}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="ghost">
            Close
          </Button>
        </DialogClose>

        {form.formState.isSubmitting ? (
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
    </fetcher.Form>
  );
}

type Props = {
  trigger: ReactNode;
  tab?: 'link' | 'collection' | 'tag';
};

export function CreateLinkDialog(props: Props) {
  const { trigger, tab = 'link' } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New</DialogTitle>
          <DialogDescription>
            Use this dialog to add a new link, collection, or tag
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={tab} className="flex flex-col gap-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="tag">Tag</TabsTrigger>
          </TabsList>
          <TabsContent value="link">
            <CreateLinkForm />
          </TabsContent>
          <TabsContent value="collection">new collection</TabsContent>
          <TabsContent value="tag">new tag</TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
