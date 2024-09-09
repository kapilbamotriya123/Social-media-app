import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { getPostDataInclude, PostPage } from '@/lib/types';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
   try {
      const cursor = req.nextUrl.searchParams.get('cursor') || undefined;

      const pageSize = 10;

      const { user } = await validateRequest();
      if (!user) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const bookmarkedPost = await prisma.bookmark.findMany({
         where: {
            userId: user.id,
         },
         include: {
            post: {
               include: getPostDataInclude(user.id),
            },
         },
         orderBy: {
            createdAt: 'desc',
         },
         take: pageSize + 1,
         cursor: cursor ? { id: cursor } : undefined,
      });

      const nextCursor =
         bookmarkedPost.length > pageSize ? bookmarkedPost[pageSize].id : null;

      const data: PostPage = {
         posts: bookmarkedPost.slice(0, pageSize).map((bp) => bp.post),
         nextCursor,
      };

      return Response.json(data);
   } catch (error) {
      console.error(error);
      return Response.json({ error: 'internal server error' }, { status: 500 });
   }
};