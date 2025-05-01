import { z } from 'zod';

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
  .refine((data) => data.password === data.verifyPassword, {
    message: 'The confirmation password doesn’t match.',
    path: ['verifyPassword'],
  });

export type SignupSchemaType = z.infer<typeof SignupSchema>;
