import { useState } from "react";
import { CheckIcon, ImportIcon, Link2OffIcon, LoaderCircleIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion.tsx";
import { Checkbox } from "../../components/ui/checkbox.tsx";
import { Typography } from "../../components/ui/typography.tsx";
import { BookmarksSuccessResponse } from "./importBookmarks.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Route } from "./+types/uploadBookmarks";
import { client } from "@/utility/honoClient.ts";
import { href, useFetcher } from "react-router";

const NO_FOLDER_KEY = "__NO_FOLDER__" as const;

export async function clientAction({ request }: Route.ClientActionArgs) {
  const { data } = await request.json();
  const response = await client.api.link.import.save.$post({ json: { data } });
  return await response.json();
}

type UploadBookmarksProps = {
  bookmarks: BookmarksSuccessResponse["data"];
};

export function UploadBookmarks({ bookmarks }: UploadBookmarksProps) {
  const fetcher = useFetcher<typeof clientAction>();

  const error = fetcher.data?.error;
  const data = fetcher.data?.data;

  const [selected, setSelected] = useState(new Set<string>());

  function toggleSelection(folderName: string) {
    if (selected.has(folderName)) {
      selected.delete(folderName);
    } else {
      selected.add(folderName);
    }
    setSelected(new Set(selected));
  }

  function onSelectAll() {
    const allFolders = new Set(Object.keys(bookmarks.groupedBookmakrs));
    setSelected(allFolders.add("Unorganized"));
  }

  function uploadBookmarks() {
    const record: Record<string, { url: string; title?: string }[]> = {};

    selected.forEach((folderName) => {
      const folder = !folderName || folderName === "Unorganized" ? NO_FOLDER_KEY : folderName;

      const bookmarksInFolder = bookmarks.groupedBookmakrs[folder] || [];

      record[folder] = bookmarksInFolder.map(({ url, title }) => ({
        url,
        title,
      }));
    });

    fetcher.submit({ data: record }, {
      method: "post",
      action: href("/resources/upload-bookmarks"),
      encType: "application/json",
    });
  }

  if (fetcher.state === "idle" && data) {
    return (
      <div className="p-10 flex flex-col gap-4 items-center justify-center rounded-md bg-cpt-mantle">
        <CheckIcon className="text-cpt-green w-6 h-6" />
        <Typography className="text-cpt-green text-center">{data.message}</Typography>
      </div>
    );
  }

  return (
    <>
      <Accordion type="single" collapsible>
        <section className="flex flex-col gap-4 p-4 rounded-md bg-cpt-mantle max-w-full overflow-x-hidden">
          <header className="flex justify-between gap-8 flex-wrap">
            <div className="flex flex-col gap-0">
              <Typography variant="base">
                Select what collections you want to save to your account
              </Typography>
              <Typography variant="small" muted>
                Found {bookmarks.foldersFound} collections and a total of{" "}
                {bookmarks.linksFound} links
              </Typography>
            </div>

            <Button variant="outline" size="xs" onClick={onSelectAll}>Select All</Button>
          </header>

          {Object.entries(bookmarks.groupedBookmakrs).map(([folderName, bookmarks]) => {
            if (bookmarks.length === 0) return null;

            const collection = (!folderName || folderName === NO_FOLDER_KEY)
              ? "Unorganized"
              : folderName;

            return (
              <div key={collection} className="p-2 overflow-x-hidden">
                <label className="flex items-center gap-2 select-none">
                  <Checkbox
                    name={collection}
                    checked={selected.has(collection)}
                    onCheckedChange={() => toggleSelection(collection)}
                  />
                  <Typography variant="small">
                    {collection}
                  </Typography>
                </label>
                <AccordionItem key={collection} value={collection}>
                  <AccordionTrigger>
                    <Typography variant="small" muted>
                      {bookmarks.length} Bookmarks
                    </Typography>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="px-4 py-2 flex flex-col gap-4">
                      {bookmarks.map((b) => (
                        <li
                          key={b.url}
                          className="flex items-start gap-2"
                        >
                          {b.icon
                            ? <img src={b.icon} height="15px" width="15px" />
                            : <Link2OffIcon className="stroke-cpt-overlay0 w-4 h-4" />}

                          <span className="flex flex-col max-w-full overflow-x-hidden whitespace-nowrap overflow-ellipsis">
                            <Typography
                              variant="small"
                              className="max-w-full overflow-x-hidden whitespace-nowrap overflow-ellipsis"
                            >
                              {b.title || "Untitled"}
                            </Typography>
                            <Typography
                              muted
                              variant="small"
                              className="max-w-full overflow-x-hidden whitespace-nowrap overflow-ellipsis"
                            >
                              {b.url}
                            </Typography>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </div>
            );
          })}
        </section>
      </Accordion>
      {fetcher.state === "idle" && error && (
        <div className="text-right">
          <Typography className="text-destructive text-right">
            {error.message ||
              "We ran into an unexpected issue. Please try again later. If the issue persists, contact support."}
          </Typography>
        </div>
      )}
      <Button className="w-fit self-end" onClick={uploadBookmarks}>
        {fetcher.state === "submitting"
          ? <LoaderCircleIcon className="animate-spin" />
          : <ImportIcon />}
        {fetcher.state === "submitting"
          ? <span>Saving Bookmarks</span>
          : <span>Save Bookmarks</span>}
      </Button>
    </>
  );
}
