import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

import type { ColorVariant } from "@/components/ColorPicker";

import { user } from "./auth-schema.ts";

const timestamps = {
  createdAt: t.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: t.integer({ mode: "timestamp" }).$onUpdateFn(() => new Date()),
};

/**
 * Identity Column
 * @docs https://orm.drizzle.team/docs/column-types/pg#identity-columns
 * */
const id = t
  .text()
  .primaryKey()
  .$defaultFn(() => uuidv4());

export * from "./auth-schema.ts";

export const usersRelations = relations(user, ({ many }) => ({
  links: many(link),
  tags: many(tag),
  collections: many(userToCollection),
}));

export const link = t.sqliteTable("link", {
  id,
  url: t.text().notNull(),
  title: t.text().notNull(),
  description: t.text(),
  previewImage: t.text(),
  favicon: t.text(),
  views: t.integer().default(1),
  lastVisit: t.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
  isPinned: t.integer({ mode: "boolean" }).default(false),
  collectionId: t.text().references(() => collection.id, { onDelete: "set null" }),
  tagId: t.text().references(() => tag.id, { onDelete: "set null" }),
  notes: t.text(),
  ownerId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const linksRelations = relations(link, ({ one }) => ({
  owner: one(user, { fields: [link.ownerId], references: [user.id] }),
  collection: one(collection, { fields: [link.collectionId], references: [collection.id] }),
  tag: one(tag, { fields: [link.tagId], references: [tag.id] }),
}));

export const collection = t.sqliteTable(
  "collection",
  {
    id,
    name: t.text().notNull(),
    description: t.text(),
    color: t.text().$type<ColorVariant>(),
    icon: t.text(),
    order: t.integer().default(1),
    parentId: t
      .text("parent_id")
      .references((): t.AnySQLiteColumn => collection.id, { onDelete: "cascade" }),
    ownerId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => ({
    uniqueOwnerAndName: t.unique().on(table.name, table.ownerId, table.parentId),
  })
);

export const collectionsRelations = relations(collection, ({ one, many }) => ({
  owner: one(user, { fields: [collection.ownerId], references: [user.id] }),
  users: many(userToCollection),
  links: many(link),
  parentCollection: one(collection, {
    fields: [collection.parentId],
    references: [collection.id],
  }),
}));

export const userToCollection = t.sqliteTable(
  "user_to_collection",
  {
    id,
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    collectionId: t
      .text()
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueUserToCollection: t.unique().on(table.userId, table.collectionId),
  })
);

export const usersToCollectionsRelations = relations(userToCollection, ({ one }) => ({
  user: one(user, { fields: [userToCollection.userId], references: [user.id] }),
  collection: one(collection, {
    fields: [userToCollection.collectionId],
    references: [collection.id],
  }),
}));

export const tag = t.sqliteTable(
  "tag",
  {
    id,
    name: t.text().notNull(),
    order: t.integer().notNull().default(1),
    ownerId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => ({
    uniqueOwnerAndName: t.unique().on(table.name, table.ownerId),
  })
);

export const tagsRelations = relations(tag, ({ one, many }) => ({
  user: one(user, { fields: [tag.ownerId], references: [user.id] }),
  links: many(link),
}));
