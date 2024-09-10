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
   mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export const createCommentSchema = z.object({
   content: requiredString,
})

//this is repeated
export const updateUserProfileSchema = z.object({
   displayName: requiredString.min(3, 'minimum three characters required'),
   bio: z.string().max(1000, 'only 1000 character allowed')
})

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>