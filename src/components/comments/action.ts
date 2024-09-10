'use server';

import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { getCommentsDataInclude, type PostData } from '@/lib/types';
import { createCommentSchema } from '@/lib/validation';

interface submitCommentsProps {
   post: PostData;
   content: string;
}

export const submitComment = async ({ post, content }: submitCommentsProps) => {
   const { content: validatedContent } = createCommentSchema.parse({ content });

   const { user } = await validateRequest();

   if (!user) {
      throw new Error('Unauthorized');
   }

   const [newComment] = await prisma.$transaction([
    prisma.comments.create({
        data: {
           postId: post.id,
           content: validatedContent,
           userId: user.id,
        },
        include: getCommentsDataInclude(user.id),
     }),
     ...(user.id !== post.userId
        ? [
              prisma.notification.create({
                  data: {
                  issuerId: user.id,
                  recipientId: post.userId,
                  postId: post.id,
                  type: 'COMMENT',
                  },
              }),
        ]
        : []
     )
   ])

   return newComment;
};

export const deleteComment = async (commentId: string) => {
   const { user } = await validateRequest();

   if (!user) {
      throw new Error('Unauthorized');
   }

   const comment = await prisma.comments.findUnique({
      where: {
         id: commentId,
      },
   });

   if (!comment) {
      throw new Error('Comment not found');
   }

   if (comment.userId !== user.id) {
      throw new Error('Unauthorized');
   }

   const deletedComment = await prisma.comments.delete({
      where: {
         id: commentId,
      },
      include: getCommentsDataInclude(user.id),
   });
   return deletedComment
};
