'use client'

import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import Post from '@/components/posts/Post';
import PostLoadingSkeleton from '@/components/posts/PostLoadingSkeleton';
import kyInstance from '@/lib/ky';
import type { PostPage } from '@/lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface SearchResultsProps {
   query: string;
}

const SearchResults = ({ query }: SearchResultsProps) => {
   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
   } = useInfiniteQuery({
      queryKey: ['post-feed', 'search', query],
      queryFn: ({ pageParam }) =>
         kyInstance
            .get('/api/search', {
               searchParams: {
                  q: query,
                  ...(pageParam ? { cursor: pageParam } : {}),
               },
            })
            .json<PostPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      gcTime: 0,
   });

   const posts = data?.pages.flatMap((page) => page.posts) || [];

   if (status === 'pending') {
      return <PostLoadingSkeleton />;
   }

   if (status === 'success' && !posts.length && !hasNextPage) {
      return (
         <p className="text-center text-muted-foreground">
            No posts found for this query.
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


export default SearchResults