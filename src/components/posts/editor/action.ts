'use server';

import { createPostSchema } from '@/lib/validation';
import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { postDataInclude } from '@/lib/types';

const submitPost = async (input: string) => {
  const { user } = await validateRequest();
  if (!user) {
    throw Error('unauthorized');
  }
  const { content } = createPostSchema.parse({ content: input });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id
    },
    include: postDataInclude
  });

  return newPost;
};

export default submitPost;
