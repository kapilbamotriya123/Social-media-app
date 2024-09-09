import prisma from '@/lib/prisma';
import { UTApi } from 'uploadthing/server';

export const GET = async (req: Request) => {
   try {
      const authHeader = req.headers.get('Authorization');

      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
         return Response.json({ error: 'unauthorized', status: 401 });
      }

      const unUsedMedia = await prisma.media.findMany({
         where: {
            post: null,
            ...(process.env.NODE_ENV === 'production'
               ? {
                    createdAt: {
                       lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                 }
               : {}),
         },
         select: {
            id: true,
            url: true,
         },
      });

      new UTApi().deleteFiles(
         unUsedMedia.map(
            (m) =>
               m.url.split(
                  `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
               )[1],
         ),
      );

      await prisma.media.deleteMany({
        where: {
            id: {
                in: unUsedMedia.map(m => m.id)
            }
        }
      })
      return new Response()
   } catch (error) {
      return Response.json({ error: 'internal server error', status: 500 });
   }
};
