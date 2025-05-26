import { useState } from "react";
import { Link2OffIcon } from "lucide-react";
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

type UploadBookmarksProps = {
  response: BookmarksSuccessResponse;
};

export function UploadBookmarks({ response }: UploadBookmarksProps) {
  const { data } = response;

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
    const allFolders = new Set(Object.keys(data.groupedBookmakrs));
    setSelected(allFolders.add("Unorganized"));
  }

  return (
    <>
      <Accordion type="single" collapsible>
        <section className="flex flex-col gap-4 p-4 rounded-md bg-cpt-mantle max-w-full overflow-x-hidden">
          <header className="flex justify-between gap-8 flex-wrap">
            <Typography as="h4">
              Found {data.foldersFound} collections and a total of {data.linksFound} bookmarks
            </Typography>

            <Button variant="outline" size="xs" onClick={onSelectAll}>Select All</Button>
          </header>

          {Object.entries(data.groupedBookmakrs).map(([folderName, bookmarks]) => {
            if (bookmarks.length === 0) return null;

            const collection = (!folderName || folderName === "__NO_FOLDER__")
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
      <Button className="w-fit self-end">Save Bookmarks</Button>
    </>
  );
}
