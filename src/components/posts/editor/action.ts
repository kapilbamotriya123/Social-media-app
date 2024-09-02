'use server';

import { createPostSchema } from '@/lib/validation';
import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';

const submitPost = async (input: string) => {
  const { user } = await validateRequest();
  if (!user) {
    throw Error('unauthorized');
  }
  const { content } = createPostSchema.parse({ content: input });

  await prisma.post.create({
    data: {
      content,
      userId: user.id
    }
  });
};

export default submitPost;
