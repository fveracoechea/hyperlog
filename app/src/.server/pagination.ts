import { type AnyColumn, type ExtractTablesWithRelations, asc, desc } from 'drizzle-orm';
import type { SQLiteSelect } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';

import * as schema from './schema';

export const PaginationSchema = z.object({
  direction: z.enum(['asc', 'desc']).default('asc').catch('asc'),
  sortBy: z.string().default('createdAt'),
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
