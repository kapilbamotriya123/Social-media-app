'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import kyInstance from '@/lib/ky';
import { PostPage } from '@/lib/types';
import PostLoadingSkeleton from '@/components/posts/PostLoadingSkeleton';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import Post from '@/components/posts/Post';
import { Loader2 } from 'lucide-react';

const Following = () => {
   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
   } = useInfiniteQuery({
      queryKey: ['post-feed', 'following'],
      queryFn: ({ pageParam }) =>
         kyInstance
            .get(
               '/api/posts/following',
               pageParam ? { searchParams: { cursor: pageParam } } : {},
            )
            .json<PostPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
   });

   const posts = data?.pages.flatMap((page) => page.posts) || [];

   if (status === 'pending') {
      return <PostLoadingSkeleton />;
   }

   if (status === 'success' && !posts.length && !hasNextPage) {
      return (
         <p className="text-center text-muted-foreground">
            No posts found. Start following people to see their posts here.
         </p>
      );
   }

   if (status === 'error') {
      return (
         <p className="text-center text-destructive">
            An error occurred while loading posts.
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
         {isFetchingNextPage && (
            <Loader2 className="mx-auto my-3 animate-spin" />
         )}
      </InfiniteScrollContainer>
   );
};

export default Following;
