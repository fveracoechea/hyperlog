import { z } from "zod";
import { fetchLinkData, match } from "@hyperlog/helpers";
import { db, schema } from "../db/db.ts";
import { eq } from "drizzle-orm";

export const kv = await Deno.openKv();

const LinkImportQueueSchema = z.object({
  type: z.literal("linkImport"),
  data: z.object({
    id: z.string().uuid(),
    url: z.string().url(),
    title: z.string(),
  }),
});

export type LinkImportQueueType = z.infer<typeof LinkImportQueueSchema>;

const QueueSchema = z.discriminatedUnion("type", [
  LinkImportQueueSchema,
]);

/**
 * Starts listening to the KV queue.
 */
export function listenQueue() {
  return kv.listenQueue(async (msg: unknown) => {
    const { data: message } = QueueSchema.safeParse(msg);
    if (!message) return;

    const { type, data } = message;

    await match(type, {
      /**
       * Handles link import requests from the queue.
       */
      async linkImport() {
        const { id, url, title } = data;
        const metadata = await fetchLinkData(url);
        await db.update(schema.link)
          .set({
            status: "active",
            title: title === "Untitled" ? metadata.title || title : title,
            favicon: metadata.favicon,
            previewImage: metadata.previewImage,
            description: metadata.description,
          })
          .where(eq(schema.link.id, id));
      },
      default() {
        console.warn(`QUEUE ERROR: Unknown message type: ${type}`);
      },
    });
  });
}
