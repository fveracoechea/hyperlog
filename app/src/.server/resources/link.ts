import { SQL, and, asc, desc, eq, ilike, or } from 'drizzle-orm';

import { db } from '../db';
import { type PaginationSchemaType, withPagination } from '../pagination';
import * as schema from '../schema';

function isKeyOf<R extends Record<PropertyKey, unknown>>(
  record: R,
  key: unknown,
): key is keyof R {
  return (
    (typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol') &&
    Object.prototype.hasOwnProperty.call(record, key)
  );
}

export async function getFavorites(userId: string) {
  return await db.query.link.findMany({
    where: and(eq(schema.link.ownerId, userId), eq(schema.link.isPinned, true)),
    with: {
      tag: true,
      collection: true,
    },
  });
}

export async function getAllLinks(userId: string, searchParams: PaginationSchemaType) {
  const search = `%${searchParams.search}%`;

  const filters: (SQL | undefined)[] = [];

  if (searchParams.search)
    filters.push(or(ilike(schema.link.title, search), ilike(schema.link.url, search)));

  const where = and(eq(schema.link.ownerId, userId), ...filters);

  const totalRecords = await db.$count(schema.link, where);

  const data = await withPagination(
    'link',
    searchParams,
    db
      .select()
      .from(schema.link)
      .leftJoin(schema.tag, eq(schema.tag.id, schema.link.tagId))
      .leftJoin(schema.collection, eq(schema.collection.id, schema.link.collectionId))
      .where(where)
      .$dynamic(),
  );

  return {
    totalRecords,
    links: data.map(item => ({ ...item.link, collection: item.collection, tag: item.tag })),
  };
}

export async function removeFromFavorites(linkId: string) {
  return await db
    .update(schema.link)
    .set({ isPinned: false })
    .where(eq(schema.link.id, linkId));
}

export async function addToFavorites(linkId: string) {
  return await db
    .update(schema.link)
    .set({ isPinned: true })
    .where(eq(schema.link.id, linkId));
}

export async function getRecentActivity(userId: string) {
  return await db.query.link.findMany({
    where: and(eq(schema.link.ownerId, userId)),
    orderBy: [asc(schema.link.lastVisit)],
    limit: 12,
    with: {
      tag: true,
      collection: true,
    },
  });
}

export async function getLinkDetails(linkId: string) {
  return await db.query.link.findFirst({
    where: and(eq(schema.link.id, linkId)),
    with: {
      tag: true,
      collection: true,
    },
  });
}

export async function addLinkToCollection(linkId: string, collectionId: string) {
  return await db
    .update(schema.link)
    .set({ collectionId: collectionId })
    .where(eq(schema.link.id, linkId));
}

export async function deleteLink(linkId: string) {
  return await db.delete(schema.link).where(eq(schema.link.id, linkId));
}
