import { and, asc, eq } from 'drizzle-orm';

import { db } from '../db';
import { type PaginationSchemaType, pagination } from '../pagination';
import * as schema from '../schema';

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
  return await pagination({
    table: 'link',
    where: [eq(schema.link.ownerId, userId)],
    searchableFields: ['title', 'url'],
    searchParams,
    findManyArgs: {
      with: {
        tag: true,
        collection: true,
      },
    },
  });
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
