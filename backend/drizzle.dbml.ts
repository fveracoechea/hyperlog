import { sqliteGenerate } from 'drizzle-dbml-generator';

import * as schema from './src/db/schema.ts';

const out = './schema.dbml';
const relational = true;

sqliteGenerate({ schema, out, relational });
