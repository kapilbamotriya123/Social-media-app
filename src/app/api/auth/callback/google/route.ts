import { google, lucia } from '@/auth';
import kyInstance from '@/lib/ky';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { OAuth2RequestError } from 'arctic';
import { generateIdFromEntropySize } from 'lucia';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
   const code = req.nextUrl.searchParams.get('code');
   const state = req.nextUrl.searchParams.get('state');

   const storedState = cookies().get('state')?.value;
   console.log('code', code)
   
   const storedCodeVerifier = cookies().get('code_verifier')?.value;
   console.log('storedState',storedState)

   if (
      !code ||
      !state ||
      !storedState ||
      !storedCodeVerifier ||
      state !== storedState
   ) {
      return new Response(null, { status: 400 });
   }
   console.log(1)
   try {
      const tokens = await google.validateAuthorizationCode(
         code,
         storedCodeVerifier,
      );
      const googleUser = await kyInstance
         .get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: {
               Authorization: `Bearer ${tokens.accessToken}`,
            },
         })
         .json<{ id: string; name: string }>();

      const existingUser = await prisma.user.findUnique({
         where: {
            id: googleUser.id,
         },
      });
      console.log(1)
      if (existingUser) {
         const session = await lucia.createSession(existingUser.id, {});
         const sessionCookie = lucia.createSessionCookie(session.id);

         cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
         )

         return new Response(null, {
            status:302,
            headers: {
                Location: '/'
            }
         })
      }
      console.log(1)
      const userId = generateIdFromEntropySize(10)
      const username = slugify(googleUser.name) + '-' + userId.slice(0,4)

      await prisma.user.create({
        data: {
          id: userId,
          username,
          displayName: googleUser.name,
          googleId: googleUser.id
        }
      });
      console.log(1)
      
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    console.log(1)
    return new Response(null, {
        status:302,
        headers: {
            Location: '/'
        }
     })
    } catch (error) {
       console.log(1)
      console.error(error);
      if(error instanceof OAuth2RequestError) {
        return new Response(null, {
            status: 400
        })
      }
      return new Response(null, {
        status: 500
      })
   }
};
