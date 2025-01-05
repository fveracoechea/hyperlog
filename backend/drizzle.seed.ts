import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { reset, seed } from 'drizzle-seed';

import { db } from './src/db/db.ts';
import * as schema from './src/db/schema.ts';

type Question = typeof schema.defaultQuestions.$inferInsert;

const questions: Question[] = [
  {
    title: 'Duration',
    body: 'What is the expected duration of this work (including options extensions) ?',
  },
  { title: 'Location', body: 'Where does the work need to be completed?' },
  {
    title: 'Shillset Level',
    body: 'What is the skill level requirement to complete this work?',
  },
  { title: 'Payments', body: 'How the work is paid for?' },
  {
    title: 'Control and Oversight',
    body: 'What is the level of supervision and direction required for this work?',
  },
  { title: 'Flexibility', body: 'Is there a clearly defined work outcome or description?' },
  {
    title: 'Compliance and Legal',
    body: 'Are there specific industry compliance requirements for this work required?',
  },
  {
    title: 'Risk Level',
    body: 'Will this work require specific handling, access to specific sensitive  confidential information?',
  },
  {
    title: 'Cultural Fit',
    body: 'How important is alignment to business and cultural values?',
  },
  {
    title: 'Equipment',
    body: 'Will Client equipment be required/needed for the work to be completed?',
  },
  { title: 'Productivity', body: 'What is the expected time to be fully productive?' },
  { title: 'Time to Hire', body: 'What is the time required to start the work?' },
];

async function main() {
  await reset(db, schema);

  await seed(db, schema).refine(f => ({
    defaultQuestions: {
      count: questions.length,
      columns: {
        title: f.string({
          isUnique: true,
        }),
        weight: f.valuesFromArray({
          values: [5, 10, 15, 20],
        }),
        order: f.int({
          minValue: 1,
          maxValue: 12,
        }),
      },
      with: {
        scores: 12,
      },
    },
    clientQuestions: {
      columns: {
        title: f.loremIpsum({ sentencesCount: 1 }),
        body: f.loremIpsum({ sentencesCount: 4 }),
        weight: f.valuesFromArray({
          values: [5, 10, 15, 20],
        }),
      },
    },
    clients: {
      columns: {
        name: f.companyName({ isUnique: true }),
      },
      with: {
        clientQuestions: 12,
        users: 12,
      },
    },
    users: {
      columns: {
        phone: f.phoneNumber(),
        jobTitle: f.jobTitle(),
      },
      with: {
        surveys: 5,
      },
    },
    surverys: {
      with: {
        responses: 12,
      },
    },
    roles: {
      count: 4,
      columns: {
        name: f.valuesFromArray({
          values: ['VISITOR', 'READ_ADMIN', 'WRITE_ADMIN', 'SUPER_ADMIN'],
          isUnique: true,
        }),
        description: f.loremIpsum({ sentencesCount: 2 }),
      },
    },
    scores: {
      columns: {
        label: f.jobTitle(),
        value: f.valuesFromArray({
          values: [0, 1, 3, 5],
        }),
      },
    },
  }));

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    await db
      .update(schema.defaultQuestions)
      .set({ ...q, order: i + 1 })
      .where(eq(schema.defaultQuestions.id, i + 1));
  }
}

main();
