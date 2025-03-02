import type { EditLinkFormFields } from '@hyperlog/shared';
import { SQL, and, desc, eq, or, sql } from 'drizzle-orm';

import { db } from '../db';
import { type PaginationSchemaType, paginationHelper } from '../pagination';
import * as schema from '../schema';

export type LinkInsertType = typeof schema.link.$inferInsert;

export async function getFavorites(userId: string) {
  return await db.query.link.findMany({
    orderBy: desc(schema.link.views),
    with: { tag: true, collection: true },
    where: and(eq(schema.link.ownerId, userId), eq(schema.link.isPinned, true)),
  });
}

export async function getAllLinks(userId: string, searchParams: PaginationSchemaType) {
  const search = `%${searchParams.search}%`.toLowerCase();
  const filters: (SQL | undefined)[] = [];

  if (searchParams.search)
    filters.push(
      or(
        sql`LOWER(${schema.link.title}) LIKE ${search}`,
        sql`LOWER(${schema.link.url}) LIKE ${search}`,
      ),
    );

  const args = paginationHelper({
    table: 'link',
    searchableFields: [],
    searchParams,
    where: [eq(schema.link.ownerId, userId), ...filters],
  });

  const results = await db.query.link.findMany({
    ...args,
    with: {
      tag: true,
      collection: true,
    },
  });

  return {
    totalRecords: Number(results.at(0)?.totalRecords ?? 0),
    links: results.map(({ totalRecords: _, ...data }) => data),
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
    orderBy: desc(schema.link.lastVisit),
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

export async function createLink(data: LinkInsertType) {
  const result = await db.insert(schema.link).values(data).returning();
  return result[0];
}

export async function deleteLink(linkId: string) {
  return await db.delete(schema.link).where(eq(schema.link.id, linkId));
}

export async function increateViewCount(linkId: string) {
  await db
    .update(schema.link)
    .set({ views: sql`${schema.link.views} + 1` })
    .where(eq(schema.link.id, linkId));
}

export async function updateLink(linkId: string, data: EditLinkFormFields) {
  const result = await db
    .update(schema.link)
    .set(data)
    .where(eq(schema.link.id, linkId))
    .returning();

  return result[0];
}
