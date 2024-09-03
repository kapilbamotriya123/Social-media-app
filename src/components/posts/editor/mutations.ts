import { useToast } from '@/hooks/use-toast';
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import submitPost from '@/components/posts/editor/action';
import { PostPage } from '@/lib/types';

const useSubmitPostMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter: QueryFilters = { queryKey: ['post-feed', 'for-you'] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                /*first page with first post*/
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor
                },
                ...oldData.pages.slice(1)
              ]
            };
          }
        }
      );

      //   so there is very slight chance if we adds the post before the content is loaded in that case the use mutation will cancel the query and no content will be laoded further
      //   for handling this every edge case we will invalidate the queries in a condition with the following syntax
      await queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return !query.state.data;
        }
      });

      toast({
        description: `Wow you just created a new post to kapil's new website`
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Failed to Post. Please try again'
      });
    }
  });
};

export default useSubmitPostMutation;
