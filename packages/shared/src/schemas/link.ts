import { z } from 'zod';

export const EditLinkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  tagId: z.string().uuid().optional().nullable().default(null),
  collectionId: z.string().optional().nullable().default(null),
  notes: z.string().optional().nullable().default(null),
});

export type EditLinkFormFields = z.infer<typeof EditLinkSchema>;
