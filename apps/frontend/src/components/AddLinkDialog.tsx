import { useMemo, useState } from "react";
import { useFetcher } from "react-router";

import { debounce } from "@/lib/time";
import clsx from "clsx";
import { Link2OffIcon, PlusIcon } from "lucide-react";

import { LazyFavicon } from "./LazyFavicon";
import { PaginationButton } from "./PaginationForm";
import { SearchInput } from "./SearchInput";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Typography } from "./ui/typography";
import { LinkListData } from "@/routes/Links.tsx";

type LinkItem = {
  databaseId: string;
  title: string;
  favicon: string | null;
};

type Props = {
  links: LinkItem[];
  onSelect(link: LinkItem): void;
};

export function AddLinkDialog(props: Props) {
  const { links, onSelect } = props;

  const fetcher = useFetcher<LinkListData>();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LinkItem[]>([]);
  const [page, setPage] = useState(1);

  const totalRecords = fetcher.data?.links.totalRecords ?? 1;
  const loading = fetcher.state === "loading";
  const pageSize = 12;
  const lastPage = Math.ceil(totalRecords / pageSize);

  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (links.length > 0) links.forEach((l) => params.append("exclude", l.databaseId));
  const url = `/links?${params}`;

  function fetchPaginatedLinks(page: number) {
    const searchParams = new URLSearchParams(params);
    searchParams.set("page", String(page));
    setPage(page);
    fetcher.load(`/links?${searchParams}`);
  }

  const debouncedSerach = useMemo(() =>
    debounce(350, (search: string) => {
      const searchParams = new URLSearchParams(params);
      if (search) searchParams.set("search", search);
      fetcher.load(`/links?${searchParams}`);
    }), []);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) fetcher.load(url);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <PlusIcon />
          <span>Add Link</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Links</DialogTitle>
          <DialogDescription>Organize groups of links with a collection</DialogDescription>
        </DialogHeader>
        <div className="flex min-w-full max-w-min flex-col gap-4 py-2">
          <SearchInput
            value={search}
            placeholder="Search by name"
            loading={fetcher.state !== "idle"}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              debouncedSerach(value);
            }}
            onClearSearch={() => {
              setSearch("");
              fetcher.load(url);
            }}
          />

          <ul
            className={clsx(
              "border-border w-ful flex h-96 flex-col gap-1 overflow-y-auto rounded-md border p-1",
              fetcher.state === "loading" && "cursor-wait opacity-50",
            )}
          >
            {(fetcher.data?.links.links ?? []).length < 1 && (
              <li className="flex items-center gap-2 px-4 py-2">
                <Link2OffIcon className="stroke-cpt-overlay0" />
                <Typography variant="small" muted>
                  No links found
                </Typography>
              </li>
            )}

            {fetcher.data &&
              fetcher.data.links.links.map((link) => (
                <li
                  key={link.id}
                  className="flex items-center gap-2 rounded-md p-2 even:bg-cpt-mantle"
                >
                  <LazyFavicon width="26px" height="26px" src={link.favicon ?? undefined} />
                  <Typography
                    variant="base"
                    as="label"
                    htmlFor={link.id}
                    muted
                    className={clsx(
                      "hover:text-foreground flex-1 cursor-pointer select-none overflow-hidden overflow-ellipsis whitespace-nowrap",
                      fetcher.state === "loading" && "cursor-wait",
                    )}
                  >
                    {link.title}
                  </Typography>
                  <Checkbox
                    id={link.id}
                    checked={selected.some((s) => s.databaseId === link.id)}
                    onCheckedChange={(state) => {
                      if (state) {
                        setSelected([...selected, { ...link, databaseId: link.id }]);
                      } else {
                        setSelected(selected.filter((s) => s.databaseId !== link.id));
                      }
                    }}
                  />
                </li>
              ))}
          </ul>
          <div className="flex items-center justify-between gap-0">
            <PaginationButton
              variant="first"
              loading={loading}
              disabled={page === 1}
              onClick={() => fetchPaginatedLinks(1)}
            />
            <PaginationButton
              variant="previous"
              loading={loading}
              disabled={page === 1}
              onClick={() => fetchPaginatedLinks(page - 1)}
            />
            <Typography muted variant="small" className="px-2">
              Page {page} of {lastPage}
            </Typography>
            <PaginationButton
              variant="next"
              loading={loading}
              disabled={page === lastPage}
              onClick={() => fetchPaginatedLinks(Math.min(lastPage, page + 1))}
            />
            <PaginationButton
              variant="last"
              loading={loading}
              disabled={page === lastPage}
              onClick={() => fetchPaginatedLinks(lastPage)}
            />
          </div>
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
                  setSearch("");
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
