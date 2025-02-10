import { z } from 'zod';

import { zPrimaryKeyId } from './generic.ts';

export const zEmail = z
  .string({ required_error: 'Email is required.' })
  .email('Invalid email address.');

export const zPassword = z
  .string({ required_error: 'Password is required.' })
  .min(6, 'Password must be at least 6 characters long.');

export const LoginSchema = z.object({
  email: zEmail,
  password: zPassword,
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const SignupSchema = z
  .object({
    name: z.string().min(1, 'Name is required.'),
    password: zPassword,
    email: zEmail,
    verifyPassword: z.string(),
  })
  .refine(data => data.password === data.verifyPassword, {
    message: 'The confirmation password doesn’t match.',
    path: ['verifyPassword'],
  });

export type SignupSchemaType = z.infer<typeof SignupSchema>;

export const SessionPayloadSchema = z.object({
  user: z.object({
    id: zPrimaryKeyId,
    firstName: z.string(),
    lastName: z.string().optional().nullable(),
    email: z.string().email(),
    isActive: z.boolean().nullable().default(true),
    locale: z.string().nullable(),
    createdAt: z.string(),
  }),
  exp: z.number(),
  iat: z.number(),
});

export type SessionPayloadSchemaType = z.infer<typeof SessionPayloadSchema>;
