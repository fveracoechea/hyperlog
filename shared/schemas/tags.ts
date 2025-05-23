import { z } from "zod";

export const CreateTagSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(60, "Name must contain at most 60 characters"),
  description: z
    .string()
    .max(512, "Description must contain at most 512 characters")
    .nullable()
    .default(null),
});

export type CreateTagSchemaType = z.infer<typeof CreateTagSchema>;

export const EditTagSchema = CreateTagSchema.extend({
  links: z
    .object({
      databaseId: z.string().uuid(),
      title: z.string(),
      favicon: z.string().nullable(),
    })
    .array(),
});

export type EditTagSchemaType = z.infer<typeof EditTagSchema>;
