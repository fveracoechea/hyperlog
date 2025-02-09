import { sqliteGenerate } from 'drizzle-dbml-generator';

import * as schema from './src/schema.ts';

const out = './drizzle/schema.dbml';
const relational = true;

sqliteGenerate({ schema, out, relational });
