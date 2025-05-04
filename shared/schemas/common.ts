import { z } from "zod";

export const ColorNames = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
  "grey",
] as const;

export type ColorName = (typeof ColorNames)[number] | null;

export const zStringArray = z
  .string()
  .array()
  .or(z.string())
  .transform((v) => (typeof v === "string" ? [v] : v))
  .optional();

export const PaginationSchema = z.object({
  direction: z.enum(["asc", "desc"]).default("desc").catch("desc"),
  sortBy: z.string().default("createdAt"),
  search: z.string().optional(),
  page: z.coerce.number().int().default(1).catch(1),
  pageSize: z.coerce.number().int().default(24).catch(24),
  exclude: zStringArray,
});

export type PaginationSchemaType = z.infer<typeof PaginationSchema>;
