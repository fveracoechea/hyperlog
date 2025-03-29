import { useState } from 'react';
import { useFetcher } from 'react-router';

import { debounce } from '@/lib/time';
import type { SubCollectionItem } from '@/routes/CollectionEdit';
import type { CollectionApiData } from '@/routes/api/collections';
import clsx from 'clsx';
import { FolderIcon, FolderXIcon, PlusIcon } from 'lucide-react';

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
  subCollections: SubCollectionItem[];
  onSelect(subCollection: SubCollectionItem): void;
};

export function AddSubCollectionDialog(props: Props) {
  const { subCollections, onSelect } = props;
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SubCollectionItem[]>([]);
  const fetcher = useFetcher<CollectionApiData>();

  const params = new URLSearchParams({ onlySubCollections: 'true' });

  if (subCollections.length > 0)
    subCollections.forEach(c => params.append('exclude', c.databaseId));

  const url = `/api/collections?${params}`;

  const debouncedLoad = debounce(300, (value: string) => {
    const searchParams = new URLSearchParams(params);
    if (value) searchParams.set('search', value);
    fetcher.load(`/api/collections?${searchParams}`);
  });

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
            placeholder="Search by name"
            loading={fetcher.state !== 'idle'}
            onChange={e => {
              const value = e.target.value;
              setSearch(value);
              debouncedLoad(value);
            }}
            onClearSearch={() => {
              setSearch('');
              fetcher.load(url);
            }}
          />

          <ul
            className={clsx(
              'border-border flex h-96 flex-col gap-1 overflow-y-auto rounded-md border p-1',
              fetcher.state === 'loading' && 'cursor-wait opacity-50',
            )}
          >
            {(fetcher.data?.collections ?? []).length < 1 && (
              <li className="flex items-center gap-2 px-4 py-2">
                <FolderXIcon className="stroke-cpt-overlay0" />
                <Typography variant="small" muted>
                  No sub-collections found
                </Typography>
              </li>
            )}

            {fetcher.data &&
              fetcher.data.collections.map(subCollection => (
                <li
                  key={subCollection.id}
                  className="even:bg-cpt-mantle flex w-full items-center gap-2 rounded-md p-2"
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
                    className={clsx(
                      'hover:text-foreground flex-1 cursor-pointer select-none overflow-hidden overflow-ellipsis whitespace-nowrap',
                      fetcher.state === 'loading' && 'cursor-wait',
                    )}
                  >
                    {subCollection.name}
                  </Typography>

                  <Checkbox
                    id={subCollection.id}
                    checked={selected.some(s => s.databaseId === subCollection.id)}
                    onCheckedChange={state => {
                      if (state) {
                        setSelected([
                          ...selected,
                          { ...subCollection, databaseId: subCollection.id },
                        ]);
                      } else {
                        setSelected(selected.filter(s => s.databaseId !== subCollection.id));
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
          <div className="flex gap-4">
            <Button
              variant="outline"
              disabled={selected.length < 1}
              onClick={() => setSelected([])}
            >
              Clear {selected.length} item(s)
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                disabled={selected.length < 1}
                onClick={() => {
                  selected.forEach(onSelect);
                  setSelected([]);
                  setSearch('');
                }}
              >
                Apply
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
