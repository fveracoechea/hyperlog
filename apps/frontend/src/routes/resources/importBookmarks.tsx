import { href, useFetcher } from "react-router";
import { ImportIcon, LoaderCircleIcon, UploadIcon } from "lucide-react";
import clsx from "clsx";

import { SubBanner } from "@/components/Banner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Typography } from "@/components/ui/typography.tsx";
import { client } from "@/utility/honoClient.ts";
import { useFileDropzone } from "@/lib/hooks/useFileDropzone.ts";

import type { Route } from "./+types/importBookmarks";
import { InferResponseType } from "hono/client";
import { UploadBookmarks } from "./uploadBookmarks.tsx";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const res = await client.api.link.import.parse.$post({ form: { file } });
  return await res.json();
}

export type BookmarksResponse = Awaited<ReturnType<typeof clientAction>>;

export type BookmarksSuccessResponse = InferResponseType<
  typeof client.api.link.import.parse.$post,
  200
>;

export function ImportBookmarks() {
  const fetcher = useFetcher<BookmarksResponse>();

  const dropzone = useFileDropzone({ autoSubmit: true });

  const { state, data: response } = fetcher;

  return (
    <div className="flex flex-col gap-4">
      <fetcher.Form
        method="post"
        className="hidden"
        encType="multipart/form-data"
        action={href("/resources/import-bookmarks")}
      >
        <input
          type="file"
          name="file"
          accept=".html, .htm"
          {...dropzone.inputProps}
        />
      </fetcher.Form>

      <SubBanner
        Icon={ImportIcon}
        title="Import Bookmarks"
        subtitle="Import your links and bookmarks from other browsers."
      />

      {(state === "idle" && response?.data)
        ? <UploadBookmarks bookmarks={response.data} />
        : (
          <Button
            variant="outline"
            onClick={dropzone.triggerFileInpuClick}
            className={clsx(
              "!p-8 h-fit rounded-md border border-border border-dashed flex items-center justify-center flex-col gap-2",
              dropzone.status === "dragging" && "border-primary",
            )}
            role="region"
            aria-live="polite"
            aria-describedby="instructions"
            {...dropzone.containerProps}
          >
            {state === "submitting"
              ? (
                <LoaderCircleIcon className="min-w-6 min-h-6 stroke-muted-foreground animate-spin" />
              )
              : (
                <UploadIcon
                  className={clsx(
                    "transition-colors min-w-6 min-h-6 stroke-muted-foreground",
                    dropzone.status === "dragging" && "stroke-primary",
                  )}
                />
              )}

            <Typography muted variant="small" id="instructions">
              Drag-and-drop or click to upload
            </Typography>

            {response?.error && state === "idle" && (
              <Typography variant="small" className="text-destructive text-right">
                {response.error?.message}
              </Typography>
            )}
          </Button>
        )}
    </div>
  );
}
