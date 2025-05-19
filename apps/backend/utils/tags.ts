import { and, eq, inArray, notInArray } from "drizzle-orm";
import { AuthUser } from "../api/auth.ts";
import { db, schema, TransactionType } from "../db/db.ts";
import { Result } from "./result.ts";

import { EditTagSchemaType } from "@hyperlog/schemas";

export async function validateTagAccess(tagId: string, user: AuthUser) {
  const tag = await db.query.tag.findFirst({ where: eq(schema.tag.id, tagId) });

  if (!tag) return Result.apiErr(404, "Tag not Found.");

  if (tag.ownerId !== user.id) {
    return Result.apiErr(403, "You are not allowed to access this record.");
  }

  return Result.ok(tag);
}

export async function updateTagLinks(
  tx: TransactionType,
  tagId: string,
  links: EditTagSchemaType["links"],
) {
  // Update removed links if any
  await tx
    .update(schema.link)
    .set({ tagId: null })
    .where(
      and(
        eq(schema.link.tagId, tagId),
        notInArray(
          schema.link.id,
          links.map((l) => l.databaseId),
        ),
      ),
    );

  // Update links with the new collection id
  await tx
    .update(schema.link)
    .set({ tagId })
    .where(
      inArray(
        schema.link.id,
        links.map((l) => l.databaseId),
      ),
    );
}
