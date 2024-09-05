import { z } from 'zod';

const requiredString = z.string().trim().min(1, 'Required');

export const signUpSchema = z.object({
   email: requiredString.email('Invalid email address'),
   username: requiredString.regex(
      /^[A-Za-z0-9_-]+$/,
      'only letters, numbers, _, and - are allowed',
   ),
   password: requiredString.min(8, 'Must be at least 8 characters'),
});

export type signUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
   username: requiredString,
   password: requiredString,
});

export type loginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
   content: requiredString,
});

export const uploadUserProfileSchema = z.object({
   displayName: requiredString.min(3, 'minimum three chars required'),
   bio: requiredString.max(1000, 'maximum 1000 characters allowed'),
});

export type UpdateUserProfileValues = z.infer<typeof uploadUserProfileSchema>;
