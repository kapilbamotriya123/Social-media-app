import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { getUserDataSelect } from '@/lib/types';

const GET = async ({
   params: { username },
}: {
   params: { username: string };
}) => {
   try {
      const { user: loggedInUser } = await validateRequest();

      if (!loggedInUser) {
         return Response.json({ error: 'unauthorised', status: 403 });
      }

      const user = await prisma.user.findFirst({
         where: {
            username: {
               equals: username,
               mode: 'insensitive',
            },
         },
         select: getUserDataSelect(loggedInUser.id),
      });

      if (!user) {
         return Response.json({ error: 'user not found ', status: 404 });
      }
      return Response.json(user);
   } catch (error) {
      console.error(error);
      return Response.json(
         { error: ' internal server error' },
         { status: 500 },
      );
   }
};
