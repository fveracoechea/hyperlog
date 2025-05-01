import { z } from 'zod';

import { ColorNames } from './common.ts';

const zColor = z
  .enum([...ColorNames])
  .nullable()
  .default(null)
  .catch(null);

export const CreateCollectionSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(60, 'Name must contain at most 60 characters'),
  color: zColor,
  description: z
    .string()
    .max(512, 'Description must contain at most 512 characters')
    .nullable()
    .default(null),
});

export const EditCollectionSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(60, 'Name must contain at most 60 characters'),
  color: zColor,
  description: z
    .string()
    .max(512, 'Description must contain at most 512 characters')
    .nullable()
    .default(null),
  links: z
    .object({
      databaseId: z.string().uuid(),
      title: z.string(),
      favicon: z.string().nullable(),
    })
    .array(),
  subCollections: z
    .object({
      name: z.string(),
      color: zColor,
      description: z.string().nullable(),
      databaseId: z.string().uuid().nullable().optional(),
    })
    .array(),
});

export type EditCollectionFormFields = z.infer<typeof EditCollectionSchema>;

export type CreateCollectionFormFields = z.infer<typeof CreateCollectionSchema>;

export const DeleteCollectionSchema = z.object({
  collectionId: z.string().uuid(),
});
