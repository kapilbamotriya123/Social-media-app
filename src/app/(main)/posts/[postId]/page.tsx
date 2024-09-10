import { validateRequest } from '@/auth';
import Post from '@/components/posts/Post';
import prisma from '@/lib/prisma';
import { getPostDataInclude } from '@/lib/types';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import UserInfoSidebar from './UserInfoSidebar';
import { Loader2 } from 'lucide-react';

interface PageProps {
   params: {
      postId: string;
   };
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {  
   const post = await prisma.post.findUnique({
      where: {
         id: postId,
      },
      include: getPostDataInclude(loggedInUserId),
   });

   if (!post) notFound();

   return post;
});

export const generateMetadata = async ({ params: { postId } }: PageProps) => {
   const { user } = await validateRequest();
   if (!user) return {};

   const post = await getPost(postId, user.id);

   return {
      title: `${post.user.displayName} : ${post.content.slice(0, 50)}...`,
   };
};

const PostPage = async ({ params: { postId } }: PageProps) => {
   const { user } = await validateRequest();
   if (!user)
      return (
         <p className="text-destructive">
            you&apos;re not authorized to view this page
         </p>
      );

   const post = await getPost(postId, user.id);

   return (
      <main className="flex w-full min-w-0 gap-5">
         <div className="w-full min-w-0 space-y-5">
            <Post post={post} />
         </div>
         <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
            <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
               <UserInfoSidebar user={post.user} />
            </Suspense>
         </div>
      </main>
   );
};

export default PostPage;
