import * as cheerio from "cheerio";
import { db, schema } from "@/db/db.ts";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export async function fetchLinkData(url: string) {
  const { origin } = new URL(url);
  try {
    const $ = await cheerio.fromURL(url);

    const title = $('meta[property="og:title"]').attr("content") || $("title").text() || null;

    const descriptionNode =
      $('head meta[property="og:description"]') || $('head meta[name="description"]');

    const image =
      $('head meta[property="og:image"]').attr("content") ||
      $('head meta[property="twitter:image"]').attr("content");

    // Look for favicon link tags
    let faviconUrl =
      $('link[rel="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href");

    // Ensure the URL is absolute
    if (faviconUrl && !faviconUrl.startsWith("http"))
      faviconUrl = new URL(faviconUrl, origin).href;

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

  if (link.ownerId !== userId)
    return ["You are not allowed to access this record.", 403] as const;

  return [null, null] as const;
}
