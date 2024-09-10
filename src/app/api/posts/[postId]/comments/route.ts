import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { getCommentsDataInclude, type CommentsPage } from '@/lib/types';
import type { NextRequest } from 'next/server';

export const GET = async (
   req: NextRequest,
   { params: { postId } }: { params: { postId: string } },
) => {
   try {
      const cursor = req.nextUrl.searchParams.get('cursor') || undefined;

      const pageSize = 5;

      const { user: loggedInUser } = await validateRequest();
      if (!loggedInUser)
         return Response.json({ error: 'unauthorised' }, { status: 401 });
      

      const comments = await prisma.comments.findMany({
         where: { postId },
         include: getCommentsDataInclude(loggedInUser.id),
         orderBy: { createdAt: 'asc' },
         take: -(pageSize + 1),
         cursor: cursor ? { id: cursor } : undefined,
      });

      const previousCursor = comments.length > pageSize ? comments[0].id : null;

      const data: CommentsPage = {
         comments: comments.length > pageSize ? comments.slice(1) : comments,
         previousCursor,
      };
      return Response.json(data);
   } catch (error) {
      return Response.json({ error: 'internal server error' }, { status: 500 });
   }
};
