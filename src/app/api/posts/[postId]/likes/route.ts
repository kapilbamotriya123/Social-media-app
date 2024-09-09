import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { LikesInfo } from '@/lib/types';

const GET = async (
   req: Request,
   { params: { postId } }: { params: { postId: string } },
) => {
   try {
      const { user: loggedInUser } = await validateRequest();
      if (!loggedInUser) {
         return Response.json({ error: 'internal server error', status: 500 });
      }

      const post = await prisma.post.findUnique({
         where: {
            id: postId,
         },
         select: {
            likes: {
               where: {
                  userId: loggedInUser.id,
               },
               select: {
                  userId: true,
               },
            },
            _count: {
               select: {
                  likes: true,
               },
            },
         },
      });

      if (!post) {
         return Response.json({ error: 'Post not found' }, { status: 404 });
      }

      const data: LikesInfo = {
         likes: post._count.likes,
         isLikedByUser: !!post.likes.length,
      };

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

      await prisma.like.upsert({
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
 
    await prisma.like.deleteMany({
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
