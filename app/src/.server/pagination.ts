import {
  type AnyColumn,
  type ExtractTablesWithRelations,
  SQL,
  and,
  asc,
  desc,
  ilike,
  or,
} from 'drizzle-orm';
import type { SQLiteSelect } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';

import { db } from './db';
import * as schema from './schema';

export const PaginationSchema = z.object({
  direction: z.enum(['asc', 'desc']).default('desc').catch('desc'),
  sortBy: z.string().default('updatedAt'),
  search: z.string().optional(),
  page: z.coerce.number().int().default(1).catch(1),
  pageSize: z.coerce.number().int().default(24).catch(24),
});

export type PaginationSchemaType = z.infer<typeof PaginationSchema>;

export async function withPagination<T extends SQLiteSelect>(
  table: keyof ExtractTablesWithRelations<typeof schema>,
  pagination: PaginationSchemaType,
  query: T,
) {
  const dbTable = schema[table] as unknown as Record<string, AnyColumn>;
  const directionFn = pagination.direction === 'asc' ? asc : desc;
  const sortBy = pagination.sortBy in dbTable ? dbTable[pagination.sortBy] : dbTable.createdAt;

  return await query
    .orderBy(directionFn(sortBy))
    .limit(pagination.pageSize)
    .offset((pagination.page - 1) * pagination.pageSize);
}

export function paginationHelper<
  K extends keyof typeof db.query,
  P extends PaginationSchemaType,
>(config: {
  table: K;
  searchableFields: K extends keyof typeof schema ? (keyof (typeof schema)[K])[] : never;
  searchParams: P;
  where?: (SQL | undefined)[];
}) {
  const { searchParams, searchableFields, where = [], table } = config;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbTable = schema[table] as Record<string, any>;
  const directionFn = searchParams.direction === 'asc' ? asc : desc;
  const sortBy =
    searchParams.sortBy in dbTable ? dbTable[searchParams.sortBy] : dbTable.updatedAt;

  if (searchParams.search) {
    const search = `%${searchParams.search}%`;
    where.push(or(...searchableFields.map(f => ilike(dbTable[f], search))));
  }

  return {
    where: and(...where),
    limit: searchParams.pageSize,
    offset: (searchParams.page - 1) * searchParams.pageSize,
    orderBy: directionFn(sortBy),
    extras: {
      totalRecords: db.$count(schema[table], and(...where)).as('totalRecords'),
    },
  };
}
