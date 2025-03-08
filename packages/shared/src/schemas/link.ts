import { z } from 'zod';

export const CreateLinkSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateLinkFormFields = z.infer<typeof CreateLinkSchema>;
