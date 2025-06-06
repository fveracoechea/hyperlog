import * as cheerio from "cheerio";
import type { Cheerio, CheerioAPI } from "cheerio";
import { db, schema, TransactionType } from "@/db/db.ts";
import { eq } from "drizzle-orm";
import { Result } from "./result.ts";

import { BookmarkImportType } from "@hyperlog/schemas";

export async function validateLinkAccess(linkId: string, userId: string) {
  const link = await db.query.link.findFirst({
    where: eq(schema.link.id, linkId),
  });

  if (!link) return ["Record not found.", 404] as const;

  if (link.ownerId !== userId) {
    return ["You are not allowed to access this record.", 403] as const;
  }

  return [null, null] as const;
}

/**
 * 25 MB in bytes
 */
export const HMLT_MAX_SIZE = 25 * 1024 * 1024;

export const NO_FOLDER_KEY = "__NO_FOLDER__" as const;

export function validateHtmlImportFile(file: File) {
  if (file.size > HMLT_MAX_SIZE) {
    return Result.responseErr(400, "File size exceeds the maximum limit of 25MB.");
  }

  if (file.type !== "text/html") {
    return Result.responseErr(400, "Invalid file type. Please upload an HTML file.");
  }

  return Result.ok("valid");
}

type Bookmark = {
  url: string;
  title?: string;
  folderName?: string;
  icon?: string;
};

function parseBookmarks(
  $: CheerioAPI,
  // deno-lint-ignore no-explicit-any
  node: Cheerio<any>,
  bookmarks: Bookmark[],
  folders: Set<string>,
  folderName?: string,
) {
  node.children("DT").each((_index, dt) => {
    const $dt = $(dt);
    const $first = $dt.children().first();

    if ($first.is("H3")) {
      const folderTitle = $first.text().trim();
      if (!folderTitle) return;

      folders.add(folderTitle);
      parseBookmarks($, $first.next("DL"), bookmarks, folders, folderTitle);
      return;
    }

    if ($first.is("A")) {
      const url = $first.attr("href");
      const icon = $first.attr("icon");
      const title = $first.text().trim();
      if (url) bookmarks.push({ url, folderName, title, icon });
      return;
    }
  });
}

export async function importBookmars(file: File) {
  const folders = new Set<string>();
  const bookmaks: Bookmark[] = [];

  const $ = cheerio.load(await file.text(), { xml: false });
  const root = $("DL").first();

  parseBookmarks($, root, bookmaks, folders);

  const groupedBookmakrs: Record<string, Bookmark[]> = {};

  for (const bookmark of bookmaks) {
    if (!URL.canParse(bookmark.url)) continue;

    if (!bookmark.folderName || bookmark.folderName === "Bookmarks bar") {
      const elements = groupedBookmakrs[NO_FOLDER_KEY] ?? [];
      elements.push(bookmark);
      groupedBookmakrs[NO_FOLDER_KEY] = elements;
      continue;
    }

    if (bookmark.folderName) {
      const elements = groupedBookmakrs[bookmark.folderName] ?? [];
      elements.push(bookmark);
      groupedBookmakrs[bookmark.folderName] = elements;
    }
  }

  return { foldersFound: folders.size, linksFound: bookmaks.length, groupedBookmakrs };
}

export async function saveBookmarks(args: {
  tx: TransactionType;
  ownerId: string;
  links: BookmarkImportType;
}) {
  const { tx, ownerId, links } = args;

  const collectionSet = new Set<string>();
  links.forEach(({ collectionName }) => {
    if (collectionName && collectionName !== NO_FOLDER_KEY) {
      collectionSet.add(collectionName);
    }
  });

  const collections = await tx
    .insert(schema.collection)
    .values(Array.from(collectionSet).map((name) => ({ name, ownerId })))
    .onConflictDoNothing({
      target: [schema.collection.name, schema.collection.parentId, schema.collection.ownerId],
    })
    .returning();

  await tx.insert(schema.link).values(
    links.map((bookmark) => {
      const title = bookmark.title || "Untitled";
      const collectionId = collections.find((c) => c.name === bookmark.collectionName)?.id;
      return {
        url: bookmark.url,
        ownerId,
        collectionId,
        title,
      };
    }),
  );
}
