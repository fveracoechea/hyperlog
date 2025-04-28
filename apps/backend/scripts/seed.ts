import { faker } from "@faker-js/faker";

import { ColorNames } from "@/components/ColorPicker";

import { db, schema } from "@/db/db.ts";

// type InsertUser = typeof schema.user.$inferInsert;
type SelectUser = typeof schema.user.$inferSelect;

type InsertLink = typeof schema.link.$inferInsert;

type InsertTag = typeof schema.tag.$inferInsert;
type SelectTag = typeof schema.tag.$inferSelect;

type InsertCollection = typeof schema.collection.$inferInsert;
type SelectCollection = typeof schema.collection.$inferSelect;
type InsertUsersToCollections = typeof schema.userToCollection.$inferInsert;

function* collectionGenerator(user: SelectUser) {
  while (true) {
    yield {
      name: `${faker.hacker.adjective()} ${faker.hacker.noun()} ${faker.hacker.verb()}`,
      description: faker.lorem.sentence({ max: 8, min: 4 }),
      color: faker.helpers.arrayElement(ColorNames),
      ownerId: user.id,
    } satisfies InsertCollection;
  }
}

function* linkGenerator(user: SelectUser) {
  while (true) {
    const hasNotes = faker.datatype.boolean({ probability: 0.5 });
    const link: InsertLink = {
      url: faker.internet.url(),
      title: faker.lorem.words({ min: 3, max: 10 }),
      description: faker.lorem.sentences(2),
      previewImage: faker.image.urlPicsumPhotos({ width: 1200, height: 600 }),
      favicon: faker.image.avatar(),
      isPinned: faker.datatype.boolean({ probability: 0.1 }),
      ownerId: user.id,
      views: faker.number.int({ min: 1, max: 1000 }),
    };
    if (hasNotes) link.notes = faker.lorem.paragraph();
    yield link;
  }
}

function* tagGenerator(user: SelectUser) {
  while (true) {
    const tag: InsertTag = {
      name: `${faker.word.adjective()} ${faker.word.noun()}`,
      ownerId: user.id,
    };
    yield tag;
  }
}

async function seedCollections(user: SelectUser) {
  const collections: InsertCollection[] = [];
  const usersToCollections: InsertUsersToCollections[] = [];

  const max = faker.number.int({ min: 4, max: 12 });

  for (const collection of collectionGenerator(user)) {
    if (collections.length > max) break;
    collections.push(collection);
  }

  const result = await db.insert(schema.collection).values(collections).returning();

  for (const collection of result) {
    const subcollections: InsertCollection[] = [];
    // Add sub collections
    if (faker.datatype.boolean()) {
      const submax = faker.number.int({ min: 1, max: 8 });

      for (const sub of collectionGenerator(user)) {
        if (subcollections.length > submax) break;
        subcollections.push({ ...sub, parentId: collection.id });
      }
    }

    if (subcollections.length > 0) {
      const subResult = await db.insert(schema.collection).values(subcollections).returning();

      for (const subcollection of subResult) {
        usersToCollections.push({ userId: user.id, collectionId: subcollection.id });
      }
    }

    usersToCollections.push({ userId: user.id, collectionId: collection.id });
  }

  await db.insert(schema.userToCollection).values(usersToCollections);

  return result;
}

async function seedTags(user: SelectUser) {
  const tags: InsertTag[] = [];
  const max = faker.number.int({ min: 2, max: 12 });

  for (const tag of tagGenerator(user)) {
    if (tags.length > max) break;
    tags.push(tag);
  }

  return await db.insert(schema.tag).values(tags).returning();
}

async function seedLinks(
  user: SelectUser,
  collections: SelectCollection[],
  tags: SelectTag[]
) {
  const links: InsertLink[] = [];

  const max = faker.number.int({ min: 20, max: 100 });

  for (const link of linkGenerator(user)) {
    if (links.length > max) break;
    links.push(link);
  }

  for (const collection of collections) {
    let count = 0;
    const max = faker.number.int({ min: 2, max: 20 });

    for (const link of linkGenerator(user)) {
      if (count > max) break;
      link.collectionId = collection.id;
      links.push(link);
      count++;
    }
  }

  for (const tag of tags) {
    let count = 0;
    const max = faker.number.int({ min: 2, max: 12 });

    for (const link of linkGenerator(user)) {
      if (count > max) break;
      link.tagId = tag.id;
      links.push(link);
      count++;
    }
  }

  return await db.insert(schema.link).values(links).returning();
}

async function main() {
  await db.delete(schema.link);
  await db.delete(schema.tag);
  await db.delete(schema.collection);

  const users = await db.query.user.findMany({ limit: 5 });

  const collections = await Promise.all(users.map(seedCollections));
  const tags = await Promise.all(users.map(seedTags));
  await Promise.all(users.map((u, i) => seedLinks(u, collections[i], tags[i])));
}

main();
