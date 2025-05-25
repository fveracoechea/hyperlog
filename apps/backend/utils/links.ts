import * as cheerio from "cheerio";
import type { Cheerio, CheerioAPI } from "cheerio";
import { db, schema } from "@/db/db.ts";
import { eq } from "drizzle-orm";
import { Result } from "./result.ts";

export async function fetchLinkData(url: string) {
  const { origin } = new URL(url);
  try {
    const $ = await cheerio.fromURL(url);

    const title = $('meta[property="og:title"]').attr("content") || $("title").text() || null;

    const descriptionNode = $('head meta[property="og:description"]') ||
      $('head meta[name="description"]');

    const image = $('head meta[property="og:image"]').attr("content") ||
      $('head meta[property="twitter:image"]').attr("content");

    // Look for favicon link tags
    let faviconUrl = $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href");

    // Ensure the URL is absolute
    if (faviconUrl && !faviconUrl.startsWith("http")) {
      faviconUrl = new URL(faviconUrl, origin).href;
    }

    return {
      title,
      favicon: faviconUrl || `${origin}/favicon.ico`,
      previewImage: image ? (image.startsWith("http") ? image : `${origin}${image}`) : null,
      description: descriptionNode.attr("content") ?? null,
    };
  } catch (error) {
    console.warn("ERROR LOADING LINK DATA  ", url);
    console.error(error);
    return {
      title: null,
      favicon: `${origin}/favicon.ico`,
      previewImage: null,
      description: null,
    };
  }
}

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
};

function parseBookmarks(
  $: CheerioAPI,
  node: Cheerio<Element>,
  bookmarks: Bookmark[],
  folders: Set<string>,
  folderName?: string,
) {
  // @ts-expect-error cheerio
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
      const title = $first.text().trim();
      if (url) bookmarks.push({ url, folderName, title });
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
    if (!bookmark.folderName || bookmark.folderName === "Bookmarks bar") {
      const elements = groupedBookmakrs["__"] ?? [];
      elements.push(bookmark);
      groupedBookmakrs["__"] = elements;
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
