import { client } from "./honoClient.ts";

export async function trackLinkActivity(linkId: string) {
  try {
    await client.api.link[":linkId"].visited.$put({ param: { linkId } });
  } catch {
    // no operation
  }
}
