import { z } from "zod";

import { ColorCodes, ColorNames } from "@/components/ColorPicker";

const zColor = z
  .enum([...ColorNames])
  .nullable()
  .default(null)
  .catch(null);

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
  tagId: z.string().uuid().nullable().default(null).catch(null),
  collectionId: z.string().uuid().nullable().default(null).catch(null),
  notes: z.string().optional().nullable().default(null),
});

export type EditLinkSchemaType = z.infer<typeof EditLinkSchema>;

export const CreateCollectionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(60, "Name must contain at most 60 characters"),
  color: zColor,
  description: z
    .string()
    .max(512, "Description must contain at most 512 characters")
    .nullable()
    .default(null),
  // parentId: z.string().uuid().nullable().default(null),
});

export const EditCollectionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(60, "Name must contain at most 60 characters"),
  color: zColor,
  description: z
    .string()
    .max(512, "Description must contain at most 512 characters")
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

export const zEmail = z
  .string({ required_error: "Email is required." })
  .email("Invalid email address.");

export const zPassword = z
  .string({ required_error: "Password is required." })
  .min(6, "Password must be at least 6 characters long.");

export const LoginSchema = z.object({
  email: zEmail,
  password: zPassword,
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const SignupSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    password: zPassword,
    email: zEmail,
    verifyPassword: z.string(),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "The confirmation password doesn’t match.",
    path: ["verifyPassword"],
  });

export type SignupSchemaType = z.infer<typeof SignupSchema>;
