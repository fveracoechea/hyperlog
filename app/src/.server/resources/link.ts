import type { EditLinkSchemaType } from '@/lib/zod';
import { SQL, and, desc, eq, notInArray, or, sql } from 'drizzle-orm';

import { db } from '../db';
import { type PaginationSchemaType, paginationHelper } from '../pagination';
import * as schema from '../schema';

export type LinkInsertType = typeof schema.link.$inferInsert;

export async function getFavorites(userId: string) {
  return await db.query.link.findMany({
    orderBy: desc(schema.link.views),
    with: { collection: true },
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

  if (searchParams.exclude) filters.push(notInArray(schema.link.id, searchParams.exclude));

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
    with: { collection: true },
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
    .set({ views: sql`${schema.link.views} + 1`, lastVisit: sql`(unixepoch())` })
    .where(eq(schema.link.id, linkId));
}

export async function updateLink(linkId: string, data: EditLinkSchemaType) {
  const result = await db
    .update(schema.link)
    .set(data)
    .where(eq(schema.link.id, linkId))
    .returning();

  return result[0];
}
