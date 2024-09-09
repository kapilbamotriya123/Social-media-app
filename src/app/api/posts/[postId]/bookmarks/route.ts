import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { LikesInfo, type BookmarkInfo } from '@/lib/types';

const GET = async (
   req: Request,
   { params: { postId } }: { params: { postId: string } },
) => {
   try {
      const { user: loggedInUser } = await validateRequest();
      if (!loggedInUser) {
         return Response.json({ error: 'internal server error', status: 500 });
      }
      const bookmark = await prisma.bookmark.findUnique({
        where: {
              userId_postId: {
                  userId: loggedInUser.id,
                  postId,
              },
          },
        });

        const data: BookmarkInfo = {
             isBookmarkedByUser: !!bookmark,
        }

      return Response.json(data);
   } catch (error) {
      console.error(error);
      return Response.json({ error: 'internal server error', status: 500 });
   }
};

export const POST = async (
   req: Request,
   { params: { postId } }: { params: { postId: string } },
) => {
   try {
      const { user: loggedInUser } = await validateRequest();
      if (!loggedInUser) {
         if (!loggedInUser) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
         }
      }

      await prisma.bookmark.upsert({
         where: {
            userId_postId: {
               userId: loggedInUser.id,
               postId,
            },
         },
         create: {
            userId: loggedInUser.id,
            postId,
         },
         update: {},
      });

      return new Response();
   } catch (error) {
      console.error(error);
      return Response.json({ error: 'Internal server error' }, { status: 500 });
   }
};

export const DELETE = async (
   req: Request,
   { params: { postId } }: { params: { postId: string } },
) => {
   try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
       return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    await prisma.bookmark.deleteMany({
       where: {
          userId: loggedInUser.id,
          postId,
       },
    });
 
    return new Response();
   } catch (error) {
      console.error(error);
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    
   }
};
