import { db } from '../db';

export async function getCollections(userId: string) {
  const result = await db.query.userToCollection.findMany({
    with: {
      collection: { with: { owner: true, links: true, users: { with: { user: true } } } },
    },
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
  });

  return result.map(relation => relation.collection);
}
