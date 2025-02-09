import { z } from 'zod';

import { zPrimaryKeyId } from './generic.ts';

export const zUsername = z
  .string({ required_error: 'Username or Email is required.' })
  .min(6, 'Username must be at least 6 characters long.');

export const zPassword = z
  .string({ required_error: 'Password is required.' })
  .min(6, 'Password must be at least 6 characters long.');

export const LoginSchema = z.object({
  username: zUsername,
  password: zPassword,
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const SignupSchema = z
  .object({
    password: zPassword,
    email: z.string().email('Invalid email address.'),
    verifyPassword: z.string(),
    name: z.string().min(1, 'Name is required.'),
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
    username: zUsername.optional().nullable(),
    isActive: z.boolean().nullable().default(true),
    locale: z.string().nullable(),
    createdAt: z.string(),
  }),
  exp: z.number(),
  iat: z.number(),
});

export type SessionPayloadSchemaType = z.infer<typeof SessionPayloadSchema>;
