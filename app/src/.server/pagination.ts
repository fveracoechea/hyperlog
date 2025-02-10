import { SQL, and, asc, desc, like, or } from 'drizzle-orm';
import { z } from 'zod';

import { db } from './db.ts';
import * as schema from './schema';

export const PaginationSchema = z.object({
  direction: z.enum(['asc', 'desc']).default('asc').catch('asc'),
  sortBy: z.string().default('createdAt'),
  search: z.string().optional(),
  page: z.coerce.number().int().default(1).catch(1),
  pageSize: z.coerce.number().int().default(24).catch(24),
});

export type PaginationSchemaType = z.infer<typeof PaginationSchema>;

/**
 * Performs advanced pagination database query, including sorting, searching, and counting of records.
 *
 * @template K - The key of the table in the database schema.
 * @template Q - The type of the search parameters.
 *
 * @param {Object} args - The arguments for the pagination function.
 * @param {K} args.table - The name of the database table to query.
 * @param {Object} [args.findManyArgs] - Additional arguments for the `findMany` method of the database query.
 * @param {Array<string>} args.searchableFields - The fields of the table that are searchable. Must exist in the schema.
 * @param {Q} args.searchParams - The search parameters, including sorting and pagination info.
 * @param {Array<SQL | undefined>} [args.where] - Additional filtering conditions for the query.
 *
 */
export async function pagination<
  K extends keyof typeof db.query,
  Q extends PaginationSchemaType,
>(args: {
  table: K;
  findManyArgs?: Parameters<(typeof db.query)[K]['findMany']>[0];
  searchableFields: K extends keyof typeof schema ? (keyof (typeof schema)[K])[] : never;
  searchParams: Q;
  where?: (SQL | undefined)[];
}) {
  const { searchParams, searchableFields, where = [], table } = args;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbTable = schema[table] as Record<string, any>;

  const directionFn = searchParams.direction === 'asc' ? asc : desc;

  const sortBy =
    searchParams.sortBy in dbTable ? dbTable[searchParams.sortBy] : dbTable.createdAt;

  if (searchParams.search) {
    const search = `%${searchParams.search}%`;
    where.push(or(...searchableFields.map(f => like(dbTable[f], search))));
  }

  const results = await db.query[table].findMany({
    where: and(...where),
    limit: searchParams.pageSize,
    offset: (searchParams.page - 1) * searchParams.pageSize,
    extras: {
      totalRecords: db.$count(schema[table], and(...where)).as('totalRecords'),
    },
    orderBy: directionFn(sortBy),
  });

  return {
    totalRecords: Number(results.at(0)?.totalRecords ?? 0),
    data: results.map(({ totalRecords: _, ...data }) => data),
  };
}
