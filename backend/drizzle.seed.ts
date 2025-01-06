import { faker } from '@faker-js/faker';
import 'dotenv/config';
import { reset } from 'drizzle-seed';
import { v4 as uuidv4 } from 'uuid';

import { db } from './src/db/db.ts';
import * as schema from './src/db/schema.ts';
import { createHasher } from './src/utils/hasher.ts';

type InsertUser = typeof schema.users.$inferInsert;

async function seedUsers() {
  const users: InsertUser[] = [];

  const password = await createHasher('secret123');

  while (users.length < 100) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push({
      id: uuidv4(),
      firstName,
      lastName,
      password,
      email: faker.internet.email({ firstName, lastName }),
      username: faker.internet.username({ firstName, lastName }),
      isActive: true,
    });
  }

  await db.insert(schema.users).values(users);
}

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await reset(db as any, schema);

  await seedUsers();
}

main();
