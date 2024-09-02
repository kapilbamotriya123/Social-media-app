'use client';

import { useQuery } from '@tanstack/react-query';
import { PostData } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Post from '@/components/posts/Post';

const ForYouFeed = () => {
  const query = useQuery<PostData[]>({
    queryKey: ['for-you', 'post-feed'],
    queryFn: async () => {
      const res = await fetch('/api/posts/for-you');
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    }
  });

  if (query.status === 'pending') {
    return (
      <div>
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );
  }

  if (query.status === 'error') {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading the post
      </p>
    );
  }

  return (
    <>
      {query.data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
};
export default ForYouFeed;
