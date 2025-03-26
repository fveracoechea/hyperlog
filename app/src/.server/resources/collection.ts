import { data } from 'react-router';

import type { CreateCollectionFormFields, EditCollectionFormFields } from '@/lib/zod';
import { SQL, and, desc, eq, isNotNull, isNull, notInArray, sql } from 'drizzle-orm';

import { db } from '../db';
import * as schema from '../schema';

export type CollectionSelectType = typeof schema.collection.$inferSelect;

export async function getMyCollections(
  userId: string,
  options?: {
    onlySubCollections?: boolean;
    onlyParentCollections?: boolean;
    search?: string | null;
    exclude?: string[];
  },
) {
  const { onlySubCollections, onlyParentCollections, search, exclude } = options ?? {};
  const result = await db.query.collection.findMany({
    with: { links: true, users: { with: { user: true } } },
    orderBy: desc(schema.collection.createdAt),
    where() {
      const filters: (SQL | undefined)[] = [];

      filters.push(eq(schema.collection.ownerId, userId));

      if (search) {
        const searchValue = `%${search}%`.toLowerCase();
        filters.push(sql`LOWER(${schema.collection.name}) LIKE ${searchValue}`);
      }

      if (onlySubCollections) filters.push(isNotNull(schema.collection.parentId));
      if (onlyParentCollections) filters.push(isNull(schema.collection.parentId));

      if (exclude && exclude.length > 0)
        filters.push(notInArray(schema.collection.id, exclude));

      return and(...filters);
    },
  });

  return result;
}

export async function getCollectionDetails(userId: string, collectionId: string) {
  const collection = await db.query.collection.findFirst({
    with: { owner: true, users: { with: { user: true } } },
    where: eq(schema.collection.id, collectionId),
  });

  if (!collection) throw data(null, { status: 404 });

  const [sharedRelation, subCollections, links] = await Promise.all([
    db.query.userToCollection.findFirst({
      where: and(
        eq(schema.userToCollection.userId, userId),
        eq(schema.userToCollection.collectionId, collectionId),
      ),
    }),
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

  if (!sharedRelation && collection.ownerId !== userId) throw data(null, { status: 403 });

  return { collection, subCollections, links };
}

export async function getAllCollections(userId: string) {
  const myCollections = await getMyCollections(userId, { onlyParentCollections: true });

  const sharedCollections = await db.query.userToCollection.findMany({
    with: {
      collection: { with: { links: true, users: { with: { user: true } } } },
    },
    where(fields, { eq, and, notInArray }) {
      return and(
        eq(fields.userId, userId),
        notInArray(
          fields.collectionId,
          myCollections.map(c => c.id),
        ),
      );
    },
  });

  return {
    myCollections,
    otherCollections: sharedCollections
      .filter(c => typeof c.collection.parentId !== 'string')
      .map(c => c.collection),
  };
}

export async function createCollection(ownerId: string, data: CreateCollectionFormFields) {
  const collection = (
    await db
      .insert(schema.collection)
      .values({ ...data, ownerId })
      .returning()
  )[0];

  return collection;
}

export async function deleteCollection(userId: string, collectionId: string) {
  const collection = await db.query.collection.findFirst({
    where: eq(schema.collection.id, collectionId),
  });

  if (collection?.ownerId === userId) {
    await db.delete(schema.collection).where(eq(schema.collection.id, collectionId));
  }
}

export async function editCollection(
  userId: string,
  collectionId: string,
  data: EditCollectionFormFields,
) {
  const collection = await db.query.collection.findFirst({
    where: eq(schema.collection.id, collectionId),
  });

  if (collection?.ownerId !== userId) {
    throw new Error('Not allowed to edit this collection');
  }
  const { subCollections, links, ...edit } = data;

  await db.update(schema.collection).set(edit).where(eq(schema.collection.id, collectionId));
}
