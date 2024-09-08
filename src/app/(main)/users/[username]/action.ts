'use server';

import {
   updateUserProfileSchema,
   UpdateUserProfileValues,
} from '@/lib/validation';
import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { getUserDataSelect } from '@/lib/types';

//updated part
export const updateProfile = async (values: UpdateUserProfileValues) => {
   const validatedValues = updateUserProfileSchema.parse(values);

   const { user } = await validateRequest();

   if(!user) throw new Error('unauthorized')

   const updatedUser = await prisma.user.update({
      where: {id: user.id},
      data: validatedValues,
      select: getUserDataSelect(user.id)
   })

   return updatedUser
};
