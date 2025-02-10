import { eq } from 'drizzle-orm';

import { db } from '../db';
import * as schema from '../schema';

export async function getSidebarData(userId: string) {
  const data = await db.query.user.findFirst({
    where: eq(schema.user.id, userId),
    with: {
      collections: { with: { collection: true } },
      tags: true,
    },
  });

  return {
    collections: data?.collections.map(c => c.collection),
    tags: data?.tags,
  };
}
