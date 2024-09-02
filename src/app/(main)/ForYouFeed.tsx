'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { PostData, PostPage } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Post from '@/components/posts/Post';
import kyInstance from '@/lib/ky';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-5">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <Button onClick={() => fetchNextPage()}>Load more</Button>
    </div>
  );
};
export default ForYouFeed;
