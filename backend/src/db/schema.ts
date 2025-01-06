import { sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';

const timestamps = {
  createdAt: t.text().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: t.text().$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),
};

/**
 * Identity Column
 * @docs https://orm.drizzle.team/docs/column-types/pg#identity-columns
 * */
const id = t
  .text()
  .primaryKey()
  .$defaultFn(() => uuidv4());

// Users Table

export const users = t.sqliteTable('users', {
  id,
  firstName: t.text(),
  lastName: t.text(),
  password: t.text().notNull(),
  email: t.text().notNull().unique(),
  username: t.text().notNull().unique(),
  isActive: t.integer({ mode: 'boolean' }),
  ...timestamps,
});

// export const userRelations = relations(users, ({ many, one }) => ({}));
