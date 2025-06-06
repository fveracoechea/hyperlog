import { db, schema } from "../db/db.ts";

await db.delete(schema.link);
await db.delete(schema.tag);
await db.delete(schema.collection);
