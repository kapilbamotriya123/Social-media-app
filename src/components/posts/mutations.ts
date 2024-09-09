import { useToast } from '@/hooks/use-toast';
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { deletePost } from '@/components/posts/actions';

import { usePathname, useRouter } from 'next/navigation';
import { PostPage } from '@/lib/types';

const useDeletePostMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      //first create a queryfilter
      const queryFilter: QueryFilters = { queryKey: ['post-feed', 'for-you'] };

      //   then cancel the queries
      await queryClient.cancelQueries(queryFilter);

      //   then set query state
      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          //   we will grab the first page to change data of that
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: oldData.pages.map((page) => ({
                nextCursor: page.nextCursor,
                posts: page.posts.filter((post) => post.id !== deletedPost.id)
              }))
            };
          }

        }
      );
      toast({
        description: 'Post Deleted'
      });
      //   if everything works set a toast
      //   if the post is deleted from the post's page then redirect to users page
      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`);
      }
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Failed to delete post'
      });
    }
  });
  return mutation;
};

export default useDeletePostMutation;
