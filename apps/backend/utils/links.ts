import * as cheerio from "cheerio";
import type { Cheerio, CheerioAPI } from "cheerio";
import { db, schema, TransactionType } from "@/db/db.ts";
import { eq } from "drizzle-orm";
import { Result } from "./result.ts";
import { kv, LinkImportQueueType } from "./kv.ts";

type LinkInsertType = typeof schema.link.$inferInsert;

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
  record: Record<string, { url: string; title?: string }[]>;
}) {
  const { tx, ownerId, record } = args;

  const entries = Object.entries(record);
  const newCollections = entries.filter(([name]) => name !== NO_FOLDER_KEY).map(([name]) => ({
    name,
    ownerId,
  }));

  const collections = await tx
    .insert(schema.collection)
    .values(
      newCollections,
    )
    .onConflictDoNothing({
      target: [schema.collection.name, schema.collection.parentId, schema.collection.ownerId],
    })
    .returning();

  const newLinks = entries.map(([collectionName, bookmarks]) => {
    const collectionId = collections.find((c) => c.name === collectionName)?.id;
    return bookmarks.map((bookmark): LinkInsertType => {
      const title = bookmark.title || "Untitled";
      return {
        title,
        ownerId,
        collectionId,
        url: bookmark.url,
        status: "pending",
      };
    });
  });

  const links = await tx.insert(schema.link).values(newLinks.flat()).returning();

  await Promise.all(links.map(async ({ id, url, title }) => {
    const message: LinkImportQueueType = {
      type: "linkImport",
      data: { id, url, title },
    };
    await kv.enqueue(message);
  }));
}
