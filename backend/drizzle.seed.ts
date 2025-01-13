import { faker } from '@faker-js/faker';
import 'dotenv/config';
import { reset } from 'drizzle-seed';
import { v4 as uuidv4 } from 'uuid';

import { db } from './src/db/db.ts';
import * as schema from './src/db/schema.ts';
import { createHasher } from './src/utils/hasher.ts';

type InsertUser = typeof schema.users.$inferInsert;
type SelectUser = typeof schema.users.$inferSelect;
type InsertLink = typeof schema.links.$inferInsert;
type InsertCollection = typeof schema.collections.$inferInsert;
type SelectCollection = typeof schema.collections.$inferSelect;
type InsertUsersToCollections = typeof schema.usersToCollections.$inferInsert;

const password = await createHasher('secret123');

function* userGenerator() {
  while (true) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    yield {
      firstName,
      lastName,
      password,
      email: faker.internet.email({ firstName, lastName }),
      username: faker.internet.username({ firstName, lastName }),
      isActive: true,
    } satisfies InsertUser;
  }
}

function* collectionGenerator(user: SelectUser) {
  while (true) {
    yield {
      name: `${faker.hacker.adjective()} ${faker.hacker.noun()} ${faker.hacker.verb()}`,
      description: faker.lorem.sentence({ max: 8, min: 4 }),
      color: faker.internet.color(),
      ownerId: user.id,
    } satisfies InsertCollection;
  }
}

function* linkGenerator(user: SelectUser) {
  while (true) {
    const link: InsertLink = {
      url: faker.internet.url(),
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      previewImage: faker.image.urlPicsumPhotos({ width: 1200, height: 600 }),
      favicon: faker.image.avatar(),
      isPinned: faker.datatype.boolean({ probability: 0.1 }),
      ownerId: user.id,
      views: faker.number.int({ min: 1, max: 1000 }),
    };
    yield link;
  }
}

async function seedUsers() {
  const users: InsertUser[] = [];

  for (const user of userGenerator()) {
    if (users.length === 100) break;
    users.push(user);
  }

  return await db.insert(schema.users).values(users).returning();
}

async function seedCollections(user: SelectUser) {
  const collections: InsertCollection[] = [];
  const usersToCollections: InsertUsersToCollections[] = [];

  const max = faker.number.int({ min: 4, max: 12 });

  for (const collection of collectionGenerator(user)) {
    if (collections.length > max) break;
    collections.push(collection);
  }

  const result = await db.insert(schema.collections).values(collections).returning();

  for (const collection of result) {
    usersToCollections.push({ userId: user.id, collectionId: collection.id });
  }

  await db.insert(schema.usersToCollections).values(usersToCollections);

  return result;
}

async function seedLinks(user: SelectUser, collections: SelectCollection[]) {
  const links: InsertLink[] = [];

  const max = faker.number.int({ min: 20, max: 100 });

  for (const link of linkGenerator(user)) {
    if (links.length > max) break;
    links.push(link);
  }

  for (const collection of collections) {
    let count = 0;
    const max = faker.number.int({ min: 3, max: 20 });

    for (const link of linkGenerator(user)) {
      if (count > max) break;
      link.collectionId = collection.id;
      links.push(link);
      count++;
    }
  }

  await db.insert(schema.links).values(links);
  return links;
}

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await reset(db as any, schema);

  const users = await seedUsers();
  const collections = await Promise.all(users.map(seedCollections));
  const links = await Promise.all(users.map((u, i) => seedLinks(u, collections[i])));
}

main();
