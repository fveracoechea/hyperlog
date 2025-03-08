import { data } from 'react-router';

import { db } from '../db';

export async function getMyCollections(userId: string) {
  const result = await db.query.collection.findMany({
    with: { links: true, users: { with: { user: true } } },
    orderBy(fields, { desc }) {
      return desc(fields.createdAt);
    },
    where(fields, { eq, and, isNull }) {
      return and(eq(fields.ownerId, userId), isNull(fields.parentId));
    },
  });

  return result;
}

export async function getCollectionDetails(userId: string, collectionId: string) {
  const collection = await db.query.collection.findFirst({
    with: { owner: true, users: { with: { user: true } } },
    where(fields, { eq }) {
      return eq(fields.id, collectionId);
    },
  });

  if (!collection) throw data(null, { status: 404 });

  const [sharedRelation, subCollections, links] = await Promise.all([
    db.query.userToCollection.findFirst({
      where(fields, { eq, and }) {
        return and(eq(fields.userId, userId), eq(fields.collectionId, collectionId));
      },
    }),
    db.query.collection.findMany({
      with: { owner: true, users: { with: { user: true } } },
      where(fields, { eq, and }) {
        return and(eq(fields.parentId, collectionId));
      },
    }),
    db.query.link.findMany({
      with: { tag: true },
      where(fields, { eq }) {
        return eq(fields.collectionId, collectionId);
      },
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
