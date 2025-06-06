import * as cheerio from "cheerio";
console.log(cheerio);

/**
 * Fetches metadata from a given URL.
 */
export async function fetchLinkData(url: string, signal?: AbortSignal) {
  const { origin } = new URL(url);

  try {
    const $ = await cheerio.fromURL(url, {
      // @ts-expect-error cheerio
      requestOptions: { signal },
    });

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
    if (error instanceof Error) {
      console.log("Error fetching link data:");
      console.log(error.message);
    }
    return {
      title: null,
      favicon: `${origin}/favicon.ico`,
      previewImage: null,
      description: null,
    };
  }
}
