import { validateRequest } from '@/auth';

export const GET = async () => {
   try {
      const { user } = await validateRequest();
      if (!user) {
         return Response.json({ error: 'unauthorized' }, { status: 401 });
      }

      const expirationTime = Math.floor(Date.now() / 1000) + 60 * 1000;
      const issuedAt = Math.floor(Date.now() / 1000) - 60;
      const token = 
   } catch (error) {
      console.error(error);
      return Response.json({ error: 'internal server error' }, { status: 500 });
   }
};
