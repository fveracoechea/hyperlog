import { z } from "zod";

export const CreateLinkSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  collectionId: z.string().uuid().nullable().default(null),
  notes: z.string().optional(),
});

export type CreateLinkFormFields = z.infer<typeof CreateLinkSchema>;

export const EditLinkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  tagId: z.string().uuid().optional(),
  collectionId: z.string().uuid().optional(),
  notes: z.string().optional().optional(),
});

export type EditLinkSchemaType = z.infer<typeof EditLinkSchema>;

export const BookmarkImportSchema = z.array(
  z.object({
    url: z.string().url(),
    title: z.string(),
    collectionName: z.string(),
    favicon: z.string(),
    previewImage: z.string().nullable(),
    description: z.string().nullable(),
  }),
);

export type BookmarkImportType = z.infer<typeof BookmarkImportSchema>;
