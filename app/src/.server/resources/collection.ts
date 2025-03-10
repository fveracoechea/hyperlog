import { data } from 'react-router';

import type { CreateCollectionFormFields } from '@/lib/zod';
import { and, desc, eq, isNull } from 'drizzle-orm';

import { db } from '../db';
import * as schema from '../schema';

export async function getMyCollections(userId: string, allowSubCollections = false) {
  const result = await db.query.collection.findMany({
    with: { links: true, users: { with: { user: true } } },
    orderBy: desc(schema.collection.createdAt),
    where() {
      if (allowSubCollections) return eq(schema.collection.ownerId, userId);
      return and(eq(schema.collection.ownerId, userId), isNull(schema.collection.parentId));
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
      with: { owner: true, links: true, users: { with: { user: true } } },
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
  const myCollections = await getMyCollections(userId);

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
