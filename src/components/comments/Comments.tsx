import type { CommentsPage, PostData } from '@/lib/types';
import CommentInput from './CommentInput';
import { useInfiniteQuery, type QueryKey } from '@tanstack/react-query';
import kyInstance from '@/lib/ky';
import Comment from './Comment';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { stat } from 'fs';

interface CommentsProps {
   post: PostData;
}

const Comments = ({ post }: CommentsProps) => {
   const queryKey: QueryKey = ['comments', post.id];
   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
   } = useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) =>
         kyInstance
            .get(
               `/api/posts/${post.id}/comments`,
               pageParam ? { searchParams: { cursor: pageParam } } : {},
            )
            .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
         pages: [...data.pages].reverse(),
         pageParams: [...data.pageParams].reverse(),
      }),
   });

   const comments = data?.pages.flatMap((page) => page.comments) || [];

   return (
      <div className="space-y-3">
         <CommentInput post={post} />
         {hasNextPage && (
            <Button
               variant={'link'}
               className="mx-auto block"
               disabled={isFetching}
               onClick={() => fetchNextPage()}
            >
               load Previous comments
            </Button>
         )}
         {status === 'pending' && <Loader2 className="mx-auto animate-spin" />}
         {status === 'success' && !comments.length && (
            <p className="text-center text-muted-foreground">
               Be the first to comment
            </p>
         )}
         {status === 'error' && (
            <p className="text-center text-destructive">
               Failed to load comments
            </p>
         )}
         <div className="divide-y">
            {comments.map((comment) => (
               <Comment comment={comment} />
            ))}
         </div>
      </div>
   );
};

export default Comments;
