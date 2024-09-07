'use server';

import {
   UpdateUserProfileValues,
   updateUserProfileSchema,
} from '@/lib/validation';
import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { getUserDataSelect } from '@/lib/types';

export const updateUserProfile = async (values: UpdateUserProfileValues) => {
   const validatedValues = updateUserProfileSchema.parse(values);

   const { user } = await validateRequest();

   if (!user) {
      throw new Error('Unauthorised');
   }

   const updatedUser = prisma.user.update({
      where: { id: user.id },
      data: validatedValues,
      select: getUserDataSelect(user.id),
   });

   return updatedUser;
};
