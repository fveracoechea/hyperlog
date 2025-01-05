import { relations } from 'drizzle-orm';
import { pgTable, timestamp } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

const timestamps = {
  updated_at: timestamp().$onUpdate(() => new Date()),
  created_at: timestamp().defaultNow().notNull(),
};

/**
 * Identity Column
 * @docs https://orm.drizzle.team/docs/column-types/pg#identity-columns
 * */
const id = t.integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 });

// Clients Table

export const clients = pgTable('clients', {
  id,
  name: t.varchar({ length: 256 }).notNull().unique(),
  email: t.varchar({ length: 256 }).notNull().unique(),
  isActive: t.boolean().default(true),
  ...timestamps,
});

export const clientRelations = relations(clients, ({ many }) => ({
  questions: many(clientQuestions),
  usersToRoles: many(usersToRoles),
  users: many(users),
}));

// Users Table

export const users = pgTable('users', {
  id,
  clientId: t
    .integer()
    .notNull()
    .references(() => clients.id),
  firstName: t.varchar({ length: 256 }),
  lastName: t.varchar({ length: 256 }),
  password: t.varchar({ length: 256 }).notNull(),
  email: t.varchar({ length: 256 }).notNull().unique(),
  username: t.varchar({ length: 256 }).notNull().unique(),
  phone: t.varchar({ length: 256 }),
  jobTitle: t.varchar({ length: 256 }),
  isActive: t.boolean().default(true),
  ...timestamps,
});

export const userRelations = relations(users, ({ many, one }) => ({
  client: one(clients, {
    fields: [users.clientId],
    references: [clients.id],
  }),
  surveys: many(surveys),
  responses: many(responses),
  usersToRoles: many(usersToRoles),
}));

// Roles Table

export const rolesEnum = t.pgEnum('roles_enum', [
  'VISITOR',
  'READ_ADMIN',
  'WRITE_ADMIN',
  'SUPER_ADMIN',
]);

export const roles = pgTable('roles', {
  id,
  name: rolesEnum().unique().notNull(),
  description: t.text(),
  ...timestamps,
});

export const rolesRelations = relations(roles, ({ many }) => ({
  usersToRoles: many(usersToRoles),
}));

// User To Roles Table (many to many)

export const usersToRoles = pgTable(
  'users_to_roles',
  {
    id,
    userId: t
      .integer()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: t
      .integer()
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    clientId: t
      .integer()
      .notNull()
      .references(() => clients.id, { onDelete: 'cascade' }),
  },
  table => ({
    // Unique Constrain, a user and client can't have duplicated roles
    unq: t.unique().on(table.roleId, table.userId, table.clientId),
  }),
);

export const userToRolesRelations = relations(usersToRoles, ({ one }) => ({
  role: one(roles, {
    fields: [usersToRoles.roleId],
    references: [roles.id],
  }),
  user: one(users, {
    fields: [usersToRoles.userId],
    references: [users.id],
  }),
  clients: one(clients, {
    fields: [usersToRoles.clientId],
    references: [clients.id],
  }),
}));

// Survey Table

export const surveys = pgTable('surveys', {
  id,
  isActive: t.boolean().default(true),
  userId: t
    .integer()
    .notNull()
    .references(() => users.id),
  ...timestamps,
});

export const surveyRelations = relations(surveys, ({ one, many }) => ({
  user: one(users, {
    fields: [surveys.userId],
    references: [users.id],
  }),
  responses: many(responses),
}));

// Scores Table

export const scoreCategoryEnum = t.pgEnum('score_type_enum', ['PERM', 'CW', 'SOW', 'GIG']);

export const scores = pgTable('scores', {
  id,
  category: scoreCategoryEnum().notNull(),
  label: t.varchar({ length: 256 }).notNull(),
  value: t.integer().notNull().default(1),
  defaultQuestionId: t
    .integer()
    .notNull()
    .references(() => defaultQuestions.id),
  ...timestamps,
});

export const scoresRelations = relations(scores, ({ one }) => ({
  defaultQuestion: one(defaultQuestions, {
    fields: [scores.defaultQuestionId],
    references: [defaultQuestions.id],
  }),
}));

// Default Questions Table

export const defaultQuestions = pgTable('default_questions', {
  id,
  title: t.varchar({ length: 256 }).notNull(), // quiestion's name
  body: t.text(), // question's scope
  order: t.integer().default(1),
  weight: t.integer(),
  ...timestamps,
});

export const defaultQuestionRelations = relations(defaultQuestions, ({ many }) => ({
  clientQuestions: many(clientQuestions),
  scores: many(scores),
}));

// Client Questions Table

export const clientQuestions = pgTable('client_questions', {
  id,
  title: t.varchar({ length: 256 }).notNull(),
  body: t.text(),
  order: t.integer().default(1),
  contentBlocks: t.json().default([]),
  isActive: t.boolean().default(true),
  weight: t.integer(),
  clientId: t
    .integer()
    .notNull()
    .references(() => clients.id),
  // Optional relation, some questions may be for data collection only.
  defaultQuestionId: t.integer().references(() => defaultQuestions.id),
  ...timestamps,
});

export const clientQuestionRelations = relations(clientQuestions, ({ one, many }) => ({
  defaultQuestion: one(defaultQuestions, {
    fields: [clientQuestions.defaultQuestionId],
    references: [defaultQuestions.id],
  }),
  client: one(clients, {
    fields: [clientQuestions.clientId],
    references: [clients.id],
  }),
  responses: many(responses),
}));

// Responses Table

export const responses = pgTable('responses', {
  id,
  data: t.json().default(null),
  clientQuestionId: t
    .integer()
    .notNull()
    .references(() => clientQuestions.id),
  userId: t
    .integer()
    .notNull()
    .references(() => users.id),
  surveyId: t
    .integer()
    .notNull()
    .references(() => surveys.id, { onDelete: 'cascade' }),
});

export const responsesRelations = relations(responses, ({ one }) => ({
  clientQuestion: one(clientQuestions, {
    fields: [responses.clientQuestionId],
    references: [clientQuestions.id],
  }),
  user: one(users, {
    fields: [responses.userId],
    references: [users.id],
  }),
  survey: one(surveys, {
    fields: [responses.surveyId],
    references: [surveys.id],
  }),
}));
