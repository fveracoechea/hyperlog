import { and, asc, desc, ilike, or, SQL } from 'drizzle-orm';
import { z } from 'zod';

import { db } from './db';
import * as schema from './schema';

export const zStringArray = z
  .string()
  .array()
  .or(z.string())
  .transform((v) => (typeof v === 'string' ? [v] : v))
  .optional();

/**
 * Search params to JS Object
 * Object.fromEntries does not account for params with multiple values
 */
export function searchParamsToJson(params: URLSearchParams) {
  const data: Record<string, string[] | string> = {};

  for (const key of params.keys()) {
    const value = params.getAll(key).filter((v) => v !== 'undefined' && v !== 'null');
    if (value.length > 1) data[key] = value;
    else data[key] = value[0];
  }

  return data;
}

export const PaginationSchema = z.object({
  direction: z.enum(['asc', 'desc']).default('desc').catch('desc'),
  sortBy: z.string().default('createdAt'),
  search: z.string().optional(),
  page: z.coerce.number().int().default(1).catch(1),
  pageSize: z.coerce.number().int().default(24).catch(24),
  exclude: zStringArray,
});

export type PaginationSchemaType = z.infer<typeof PaginationSchema>;

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
  const sortBy = searchParams.sortBy in dbTable
    ? dbTable[searchParams.sortBy]
    : dbTable.createdAt;

  if (searchParams.search) {
    const search = `%${searchParams.search}%`;
    where.push(or(...searchableFields.map((f) => ilike(dbTable[f], search))));
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
