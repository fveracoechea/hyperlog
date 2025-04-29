import z from "zod";
import { db, schema, TransactionType } from "@/db/db.ts";
import { and, desc, eq, inArray, isNotNull, isNull, notInArray, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { EditCollectionFormFields } from "@hyperlog/schemas";
import { isNonNullable } from "@hyperlog/ui";

export const CollectionQuerySchema = z.object({
  search: z.string().optional(),
  exclude: z.string().array().optional(),
});

export function getCollections(args: {
  type: "parent" | "child";
  query: z.infer<typeof CollectionQuerySchema>;
  userId: string;
}) {
  const { query, type, userId } = args;
  const { search, exclude } = query;

  const filters = [
    eq(schema.collection.ownerId, userId),
    type === "parent"
      ? isNull(schema.collection.parentId)
      : isNotNull(schema.collection.parentId),
  ];

  if (search) {
    const searchValue = `%${search}%`.toLowerCase();
    filters.push(sql`LOWER(${schema.collection.name}) LIKE ${searchValue}`);
  }

  if (exclude && exclude.length > 0) {
    filters.push(notInArray(schema.collection.id, exclude));
  }

  return db.query.collection.findMany({
    with: { links: true, users: { with: { user: true } } },
    orderBy: desc(schema.collection.createdAt),
    where: and(...filters),
  });
}

export async function getCollectionDetails(userId: string, collectionId: string) {
  let error: HTTPException | null = null;

  const [collection, sharedRelation] = await Promise.all([
    db.query.collection.findFirst({
      with: { owner: true, users: { with: { user: true } } },
      where: eq(schema.collection.id, collectionId),
    }),
    db.query.userToCollection.findFirst({
      where: and(
        eq(schema.userToCollection.userId, userId),
        eq(schema.userToCollection.collectionId, collectionId)
      ),
    }),
  ]);

  if (!collection) {
    error = new HTTPException(404, { message: "Collection not found." });
  } else if (!sharedRelation && collection.ownerId !== userId) {
    error = new HTTPException(403, {
      message: "You are not allowed to access this collection.",
    });
  }

  if (error) return [null, error] as const;

  const [subCollections, links] = await Promise.all([
    db.query.collection.findMany({
      with: { owner: true, links: true },
      orderBy: desc(schema.collection.createdAt),
      where: and(eq(schema.collection.parentId, collectionId)),
    }),
    db.query.link.findMany({
      with: { tag: true },
      orderBy: desc(schema.link.createdAt),
      where: eq(schema.link.collectionId, collectionId),
    }),
  ]);

  return [{ collection, subCollections, links }, null] as const;
}

export async function updateCollectionLinks(
  tx: TransactionType,
  collectionId: string,
  links: EditCollectionFormFields["links"]
) {
  // Update removed links if any
  await tx
    .update(schema.link)
    .set({ collectionId: null })
    .where(
      and(
        eq(schema.link.collectionId, collectionId),
        notInArray(
          schema.link.id,
          links.map((l) => l.databaseId)
        )
      )
    );

  // Update links with the new collection id
  await tx
    .update(schema.link)
    .set({ collectionId })
    .where(
      inArray(
        schema.link.id,
        links.map((l) => l.databaseId)
      )
    );
}

export async function updateSubCollections(
  tx: TransactionType,
  parentId: string,
  ownerId: string,
  subCollections: EditCollectionFormFields["subCollections"]
) {
  try {
    const IDs = subCollections.map((s) => s.databaseId).filter(isNonNullable);

    const newSubcollections = subCollections
      .filter((s) => !s.databaseId)
      .map(({ databaseId: _, ...s }) => ({ ...s, parentId, ownerId }));

    await tx
      .delete(schema.collection)
      .where(
        and(eq(schema.collection.parentId, parentId), notInArray(schema.collection.id, IDs))
      );

    if (newSubcollections.length > 0) {
      await tx.insert(schema.collection).values(newSubcollections);
    }
  } catch (error) {
    console.warn("UPDATE SUB-COLLECTIONS ERROR");
    console.error(error);
    throw new HTTPException(500, { cause: error });
  }
}

export async function validateCollectionAccess(collectionId: string, userId: string) {
  const collection = await db.query.collection.findFirst({
    where: eq(schema.collection.id, collectionId),
  });

  if (!collection) return [{ message: "Collection not found." }, 404] as const;

  if (collection.ownerId !== userId)
    return [{ message: "You are not allowed to edit this collection." }, 403] as const;

  return [null, null] as const;
}
