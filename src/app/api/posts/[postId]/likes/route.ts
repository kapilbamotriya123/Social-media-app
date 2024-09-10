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
      const post = await prisma.post.findFirst({
         where: { id: postId },
         select: { userId: true },
      });

      if (!post) {
         return Response.json({ error: 'Post not found' }, { status: 401 });
      }

      await prisma.$transaction([
         prisma.like.upsert({
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
         }),
         //this is an interesting syntax what this is doing adding an item to the array if the condition is true which is done with this ternary operator and these spread operator
         ...(loggedInUser.id  !== post.userId 
            ? [prisma.notification.create({
               data: {
                  issuerId: loggedInUser.id,
                  recipientId: post.userId,
                  postId: postId,
                  type: 'LIKE',
                  
               }
            })]
            : []
         )
      ])



      


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

      const post = await prisma.post.findFirst({
         where: { id: postId },
         select: { userId: true },
      });

      if (!post) {
         return Response.json({ error: 'Post not found' }, { status: 401 });
      }
      await prisma.$transaction([
         prisma.like.deleteMany({
            where: {
               userId: loggedInUser.id,
               postId,
            },
         }),
         prisma.notification.deleteMany({
            where: {
               postId: postId,
               issuerId: loggedInUser.id,
               type: 'LIKE',
               recipientId: post.userId,
            }
         })
      ])

      

      return new Response();
   } catch (error) {
      console.error(error);
      return Response.json({ error: 'Internal server error' }, { status: 500 });
   }
};
