import { type ExtractTablesWithRelations, sql } from 'drizzle-orm';
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
  const field = pagination.sortBy in schema[table] ? pagination.sortBy : 'createdAt';

  if (!(field in schema[table])) throw new Error('INVALID SORT BY');

  console.log(
    query
      .orderBy(
        sql`${sql.identifier(table)}.${sql.identifier(field)} ${sql.raw(pagination.direction)}`,
      )
      .limit(pagination.pageSize)
      .offset((pagination.page - 1) & pagination.pageSize)
      .toSQL(),
  );

  return await query
    .orderBy(
      sql`${sql.identifier(table)}.${sql.identifier(field)} ${sql.raw(pagination.direction)}`,
    )
    .limit(pagination.pageSize)
    .offset((pagination.page - 1) & pagination.pageSize);
}
