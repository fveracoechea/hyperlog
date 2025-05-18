import { defineConfig } from "drizzle-kit";
import process from "node:process";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "sqlite",
  casing: "snake_case",
  dbCredentials: {
    url: `file:${process.env.DB_FILENAME}`,
  },
});
