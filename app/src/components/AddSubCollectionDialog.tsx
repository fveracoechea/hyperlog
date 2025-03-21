import { useState } from 'react';
import { useFetcher } from 'react-router';

import type { CollectionSelectType } from '@/.server/resources/collection';
import { debounce } from '@/lib/time';
import type { CollectionApiData } from '@/routes/api/collections';
import { FolderIcon, FolderXIcon, LoaderCircleIcon, PlusIcon } from 'lucide-react';

import { SearchInput } from './SearchInput';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
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
import { Typography } from './ui/typography';

type Props = {
  subCollections: CollectionSelectType[];
  onSelect(subCollection: CollectionSelectType): void;
};

export function AddSubCollectionDialog(props: Props) {
  const { subCollections, onSelect } = props;
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CollectionSelectType[]>([]);
  const fetcher = useFetcher<CollectionApiData>();

  const params = new URLSearchParams({ noParentCollections: 'true' });
  if (search) params.set('search', search);
  if (selected.length > 0) selected.forEach(c => params.append('exclude', c.id));
  const url = `/api/collections?${params}`;

  const debouncedLoad = debounce(350, (searchParams: URLSearchParams) =>
    fetcher.load(`/api/collections?${searchParams}`),
  );

  return (
    <Dialog
      onOpenChange={open => {
        if (open) fetcher.load(url);
      }}
    >
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
        <div className="flex flex-col gap-4 py-2">
          <SearchInput
            value={search}
            loading={fetcher.state === 'loading'}
            onChange={e => {
              const value = e.target.value;
              setSearch(value);
              const searchParams = new URLSearchParams(params);
              if (value) searchParams.set('search', value);
              debouncedLoad(searchParams);
            }}
            onClearSearch={() => {
              setSearch('');
              fetcher.load(url);
            }}
          />

          <ul className="border-border flex max-h-96 flex-col gap-1 overflow-y-auto rounded-md border p-1">
            {subCollections.length < 1 && (
              <li className="flex items-center gap-2 px-4 py-2">
                <FolderXIcon className="stroke-cpt-overlay0" />
                <Typography variant="small" muted>
                  No sub-collections available.
                </Typography>
              </li>
            )}

            {fetcher.state === 'loading' &&
              new Array(8)
                .fill(1)
                .map((n, i) => (
                  <li
                    key={n + i}
                    aria-busy="true"
                    className="bg-cpt-surface0 mb-2 flex min-h-8 flex-1 animate-pulse cursor-wait rounded-md"
                  />
                ))}

            {fetcher.state === 'idle' &&
              fetcher.data &&
              fetcher.data.collections.map(subCollection => (
                <li
                  key={subCollection.id}
                  className="even:bg-cpt-mantle flex flex-1 items-center gap-2 rounded-md p-2"
                >
                  <FolderIcon
                    className="h-5 min-h-5 w-5 min-w-5"
                    style={{
                      stroke: subCollection?.color ?? undefined,
                      fill: subCollection?.color ?? undefined,
                    }}
                  />
                  <Typography
                    variant="base"
                    as="label"
                    htmlFor={subCollection.id}
                    muted
                    className="hover:text-foreground flex-1 cursor-pointer select-none overflow-hidden overflow-ellipsis whitespace-nowrap"
                  >
                    {subCollection.name}
                  </Typography>

                  <Checkbox
                    id={subCollection.id}
                    checked={selected.some(s => s.id === subCollection.id)}
                    onCheckedChange={state => {
                      if (state) {
                        setSelected([...selected, subCollection]);
                      } else {
                        setSelected(selected.filter(s => s.id !== subCollection.id));
                      }
                    }}
                  />
                </li>
              ))}
          </ul>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                selected.forEach(onSelect);
                setSelected([]);
                setSearch('');
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
