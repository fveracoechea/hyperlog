import { and, asc, desc, or, SQL, sql } from "drizzle-orm";

import { db, schema } from "@/db/db.ts";
import { PaginationSchemaType } from "@hyperlog/schemas";

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

  // deno-lint-ignore no-explicit-any
  const dbTable = schema[table] as Record<string, any>;
  const directionFn = searchParams.direction === "asc" ? asc : desc;
  const sortBy = searchParams.sortBy in dbTable
    ? dbTable[searchParams.sortBy]
    : dbTable.createdAt;

  if (searchParams.search) {
    const search = `%${searchParams.search}%`.toLowerCase();
    where.push(
      or(...searchableFields.map((field) => sql`LOWER(${dbTable[field]}) LIKE ${search}`)),
    );
  }

  return {
    where: and(...where),
    limit: searchParams.pageSize,
    offset: (searchParams.page - 1) * searchParams.pageSize,
    orderBy: directionFn(sortBy),
    extras: {
      totalRecords: db.$count(schema[table], and(...where)).as("totalRecords"),
    },
  };
}
