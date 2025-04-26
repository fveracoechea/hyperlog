import { data } from 'react-router';

import { isNonNullable } from '@/lib/helpers';
import type { CreateCollectionFormFields, EditCollectionFormFields } from '@/lib/zod';
import { SQL, and, desc, eq, inArray, isNotNull, isNull, notInArray, sql } from 'drizzle-orm';
import { fromPromise } from 'neverthrow';

import { type TransactionType, db, isSQLiteErrorCode } from '../db';
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

export function createCollection(ownerId: string, formData: CreateCollectionFormFields) {
  return fromPromise(
    db
      .insert(schema.collection)
      .values({ ...formData, ownerId })
      .returning()
      .then(data => {
        const collection = data.at(0);
        if (!collection) throw new Error('No data');
        return collection;
      }),
    err => {
      if (isSQLiteErrorCode(err, 'SQLITE_CONSTRAINT_UNIQUE')) {
        return 'COLLECTION_NAME_ALREADY_EXISTS';
      }

      console.warn('SUB-COLLECTIONS UPDATE UKNOWN_DATABASE_ERROR');
      console.error(err);
      return 'UKNOWN_DATABASE_ERROR';
    },
  );
}

export async function deleteCollection(userId: string, collectionId: string) {
  const collection = await db.query.collection.findFirst({
    where: eq(schema.collection.id, collectionId),
  });

  if (collection?.ownerId === userId) {
    await db.delete(schema.collection).where(eq(schema.collection.id, collectionId));
  }
}

async function updateCollectionLinks(
  tx: TransactionType,
  collectionId: string,
  links: EditCollectionFormFields['links'],
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
          links.map(l => l.databaseId),
        ),
      ),
    );

  // Update links with the new collection id
  await tx
    .update(schema.link)
    .set({ collectionId })
    .where(
      inArray(
        schema.link.id,
        links.map(l => l.databaseId),
      ),
    );
}

async function updateSubCollections(
  tx: TransactionType,
  parentId: string,
  ownerId: string,
  subCollections: EditCollectionFormFields['subCollections'],
) {
  try {
    const IDs = subCollections.map(s => s.databaseId).filter(isNonNullable);

    const newSubcollections = subCollections
      .filter(s => !s.databaseId)
      .map(({ databaseId: _, ...s }) => ({ ...s, parentId, ownerId }));

    await tx
      .delete(schema.collection)
      .where(
        and(eq(schema.collection.parentId, parentId), notInArray(schema.collection.id, IDs)),
      );

    if (newSubcollections.length > 0) {
      await tx.insert(schema.collection).values(newSubcollections);
    }
  } catch (error) {
    console.warn('UPDATE SUB-COLLECTIONS ERROR');
    console.error(error);
  }
}

export async function editCollection(
  userId: string,
  collectionId: string,
  formData: EditCollectionFormFields,
) {
  const collection = await db.query.collection.findFirst({
    where: eq(schema.collection.id, collectionId),
  });

  if (collection?.ownerId !== userId) {
    throw data('You are not allowed to edit this collection', { status: 403 });
  }

  db.transaction(async tx => {
    const { subCollections, links, ...edit } = formData;
    await tx.update(schema.collection).set(edit).where(eq(schema.collection.id, collectionId));
    await updateCollectionLinks(tx, collectionId, links);
    await updateSubCollections(tx, collectionId, userId, subCollections);
  });
}
