import { useToast } from '@/hooks/use-toast';
import kyInstance from '@/lib/ky';
import { BookmarkInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
   useMutation,
   useQuery,
   useQueryClient,
   type QueryKey,
} from '@tanstack/react-query';
import { Bookmark, Heart } from 'lucide-react';

interface BookmarkButtonProps {
   postId: string;
   initialState: BookmarkInfo;
}

const BookmarkButton = ({ postId, initialState }: BookmarkButtonProps) => {
   const { toast } = useToast();

   const queryClient = useQueryClient();

   const queryKey: QueryKey = ['bookmark-info', postId];

   const { data } = useQuery({
      queryKey,
      queryFn: () =>
         kyInstance.get(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
      initialData: initialState,
      staleTime: Infinity,
   });

   const { mutate } = useMutation({
      mutationFn: data.isBookmarkedByUser
         ? () => kyInstance.delete(`/api/posts/${postId}/bookmarks`)
         : () => kyInstance.post(`/api/posts/${postId}/bookmarks`),
      onMutate: async () => {
         toast({
            variant: 'default',
            description: data.isBookmarkedByUser
               ? 'Bookmark removed'
               : 'Bookmark added',
         });

         await queryClient.cancelQueries({ queryKey });
         const previousData = queryClient.getQueryData<BookmarkInfo>(queryKey);

         queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
            isBookmarkedByUser: !previousData?.isBookmarkedByUser,
         }));

         return { previousData };
      },
      onError: (error, variables, context) => {
         queryClient.setQueryData(queryKey, context?.previousData);
         console.error(error);
         toast({
            variant: 'destructive',
            description: 'An error occurred',
         });
      },
   });

   return (
      <button onClick={() => mutate()} className="flex items-center gap-2">
         <Bookmark
            className={cn(
               'size-5',
               data.isBookmarkedByUser && 'fill-primary text-primary',
            )}
         />
      </button>
   );
};
export default BookmarkButton;
