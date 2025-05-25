import { Typography } from "../../components/ui/typography.tsx";
import { BookmarksSuccessResponse } from "./importBookmarks.tsx";

type UploadBookmarksProps = {
  response: BookmarksSuccessResponse;
};
export function UploadBookmarks({ response }: UploadBookmarksProps) {
  const { data } = response;
  return (
    <div className="p-2 border border-border rounded-md max-h-[50vh] overflow-y-auto">
      {Object.entries(data.groupedBookmakrs).map(([folderName, bookmarks]) => (
        <>
          <Typography>{folderName}</Typography>
          <ul className="p-2">
            {bookmarks.map((b) => (
              <li key={b.url} className="flex items-center gap-2">
                {b.title}
              </li>
            ))}
          </ul>
        </>
      ))}
    </div>
  );
}
