import { useFetcher } from 'react-router';

import { FormField } from './FormField';

export function CreateLinkForm() {
  const fetcher = useFetcher();
  return (
    <fetcher.Form>
      <FormField name="title" label="Title" />
    </fetcher.Form>
  );
}
