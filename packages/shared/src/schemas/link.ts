import { z } from 'zod';

export const EditLinkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  tagId: z.string().uuid().nullable().default(null).catch(null),
  collectionId: z.string().uuid().nullable().default(null).catch(null),
  notes: z.string().optional().nullable().default(null),
});

export type EditLinkFormFields = z.infer<typeof EditLinkSchema>;

export const CreateLinkSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateLinkFormFields = z.infer<typeof CreateLinkSchema>;
