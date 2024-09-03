'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { PostPage } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Post from '@/components/posts/Post';
import kyInstance from '@/lib/ky';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';

const ForYouFeed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['post-feed', 'for-you'],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          '/api/posts/for-you',
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<PostPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === 'pending') {
    return (
      <div>
        <Loader2 className="mx-auto animate-spin" />
      </div>
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
export default ForYouFeed;
