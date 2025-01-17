import { relations, sql } from 'drizzle-orm';
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
  firstName: t.text().notNull(),
  lastName: t.text(),
  password: t.text().notNull(),
  email: t.text().notNull().unique(),
  locale: t.text().default('en'),
  username: t.text().unique(),
  isActive: t.integer({ mode: 'boolean' }).notNull().default(false),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
  tags: many(tags),
  collections: many(usersToCollections),
}));

export const links = t.sqliteTable('links', {
  id,
  url: t.text().notNull(),
  title: t.text(),
  description: t.text(),
  previewImage: t.text(),
  favicon: t.text(),
  views: t.integer().default(0),
  lastVisit: t.text().default(sql`(CURRENT_TIMESTAMP)`),
  isPinned: t.integer({ mode: 'boolean' }).default(false),
  collectionId: t.text().references(() => collections.id),
  tagId: t.text().references(() => tags.id),
  ownerId: t
    .text()
    .notNull()
    .references(() => users.id),
  ...timestamps,
});

export const linksRelations = relations(links, ({ one }) => ({
  owner: one(users, { fields: [links.ownerId], references: [users.id] }),
  collection: one(collections, { fields: [links.collectionId], references: [collections.id] }),
  tag: one(tags, { fields: [links.tagId], references: [tags.id] }),
}));

export const collections = t.sqliteTable(
  'collections',
  {
    id,
    name: t.text().notNull(),
    description: t.text(),
    color: t.text(),
    icon: t.text(),
    order: t.integer().default(1),
    parentId: t.text('parent_id').references((): t.AnySQLiteColumn => collections.id),
    ownerId: t
      .text()
      .notNull()
      .references(() => users.id),
    ...timestamps,
  },
  table => ({
    uniqueOwnerAndName: t.unique().on(table.name, table.ownerId),
  }),
);

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  owner: one(users, { fields: [collections.ownerId], references: [users.id] }),
  users: many(usersToCollections),
  // childCollections: many(collections, {
  //   relationName: 'parent_id',
  // }),
  parentCollection: one(collections, {
    fields: [collections.parentId],
    references: [collections.id],
  }),
}));

export const usersToCollections = t.sqliteTable(
  'users_to_collections',
  {
    id,
    userId: t
      .text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    collectionId: t
      .text()
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
  },
  table => ({
    uniqueUserToCollection: t.unique().on(table.userId, table.collectionId),
  }),
);

export const usersToCollectionsRelations = relations(usersToCollections, ({ one }) => ({
  user: one(users, { fields: [usersToCollections.userId], references: [users.id] }),
  collection: one(collections, {
    fields: [usersToCollections.collectionId],
    references: [collections.id],
  }),
}));

export const tags = t.sqliteTable(
  'tags',
  {
    id,
    name: t.text().notNull(),
    order: t.integer().notNull().default(1),
    ownerId: t
      .text()
      .notNull()
      .references(() => users.id),
    ...timestamps,
  },
  table => ({
    uniqueOwnerAndName: t.unique().on(table.name, table.ownerId),
  }),
);

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, { fields: [tags.ownerId], references: [users.id] }),
  links: many(links),
}));
