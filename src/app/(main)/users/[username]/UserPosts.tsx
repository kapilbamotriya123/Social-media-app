'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { PostPage } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Post from '@/components/posts/Post';
import kyInstance from '@/lib/ky';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import PostLoadingSkeleton from '@/components/posts/PostLoadingSkeleton';

interface UserPostProp {
   userId: string;
}

const UserPost = ({ userId }: UserPostProp) => {
   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
   } = useInfiniteQuery({
      queryKey: ['post-feed', 'user-posts', userId],
      queryFn: ({ pageParam }) =>
         kyInstance
            .get(
               `/api/users/${userId}/posts`,
               pageParam ? { searchParams: { cursor: pageParam } } : {},
            )
            .json<PostPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
   });

   const posts = data?.pages.flatMap((page) => page.posts) || [];

   if (status === 'pending') {
      return (
         <div>
            <PostLoadingSkeleton />
         </div>
      );
   }

   if (status === 'success' && !posts.length && !hasNextPage) {
      return (
         <p className="text-center text-destructive">
            User has note Made any post
         </p>
      );
   }

   if (status === 'error') {
      return (
         <p className="text-center text-destructive">
            An error occurred while loading the post
         </p>
      );
   }

   return (
      <InfiniteScrollContainer
         className="space-y-5"
         onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
         {posts.map((post) => (
            <Post key={post.id} post={post} />
         ))}
         {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
      </InfiniteScrollContainer>
   );
};
export default UserPost;
