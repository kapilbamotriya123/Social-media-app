import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { FollowerInfo } from '@/lib/types';

export const GET = async (
   req: Request,
   { params: { userId } }: { params: { userId: string } },
) => {
   try {
      const { user: loggedInUser } = await validateRequest();

      if (!loggedInUser) {
         return Response.json({ error: 'unauthorized' }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
         where: { id: userId },
         select: {
            followers: {
               where: {
                  followerId: loggedInUser.id,
               },
               select: {
                  followerId: true,
               },
            },
            _count: {
               select: {
                  followers: true,
               },
            },
         },
      });
      if (!user)
         return Response.json({ error: 'User not found' }, { status: 404 });

      const data: FollowerInfo = {
         followers: user._count.followers,
         isFollowedByUser: !!user.followers.length, //this can be either one which is loggedIn user or just nothing
      };

      return Response.json(data);
   } catch {
      Response.json({ error: 'internal server error' }, { status: 500 });
   }
};
export const POST = async (
   req: Request,
   { params: { userId } }: { params: { userId: string } },
) => {
   try {
      const { user: loggedInUser } = await validateRequest();

      if (!loggedInUser) {
         return Response.json({ error: 'unauthorized' }, { status: 401 });
      }
      if (!userId)
         return Response.json({ error: 'bad request' }, { status: 400 });
      await prisma.follow.upsert({
         where: {
            followerId_followingId: {
               followerId: loggedInUser.id,
               followingId: userId,
            },
         },
         create: {
            followerId: loggedInUser.id,
            followingId: userId,
         },
         update: {},
      });
      return new Response();
   } catch {
      Response.json({ error: 'internal server error' }, { status: 500 });
   }
};
export const DELETE = async (
   req: Request,
   { params: { userId } }: { params: { userId: string } },
) => {
   try {
      const { user: loggedInUser } = await validateRequest();

      if (!loggedInUser) {
         return Response.json({ error: 'unauthorized' }, { status: 401 });
      }
      await prisma.follow.deleteMany({
         where: {
            followerId: loggedInUser.id,
            followingId: userId,
         },
      });
      return new Response();
   } catch {
      Response.json({ error: 'internal server error' }, { status: 500 });
   }
};
