import { useToast } from '@/hooks/use-toast';
import kyInstance from '@/lib/ky';
import { LikesInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
   useMutation,
   useQuery,
   useQueryClient,
   type QueryKey,
} from '@tanstack/react-query';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
   postId: string;
   initialState: LikesInfo;
}

const LikeButton = ({ postId, initialState }: LikeButtonProps) => {
   const { toast } = useToast();

   const queryClient = useQueryClient();

   const queryKey: QueryKey = ['likes-info', postId];

   const { data } = useQuery({
      queryKey,
      queryFn: () =>
         kyInstance.get(`/api/posts/${postId}/likes`).json<LikesInfo>(),
      initialData: initialState,
      staleTime: Infinity,
   });

   const { mutate } = useMutation({
      mutationFn: data.isLikedByUser
         ? () => kyInstance.delete(`/api/posts/${postId}/likes`)
         : () => kyInstance.post(`/api/posts/${postId}/likes`),
      onMutate: async () => {
         await queryClient.cancelQueries({ queryKey });
         const previousData = queryClient.getQueryData<LikesInfo>(queryKey);

         queryClient.setQueryData<LikesInfo>(queryKey, () => ({
            likes:
               (previousData?.likes || 0) +
               (previousData?.isLikedByUser ? -1 : 1),
            isLikedByUser: !previousData?.isLikedByUser,
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
         <Heart
            className={cn(
               'size-5',
               data.isLikedByUser && 'fill-red-500 text-red-500',
            )}
         />
         <span className="text-sm font-medium tabular-nums">{data.likes}</span>
         <span className="hidden sm:inline">likes</span>
      </button>
   );
};
export default LikeButton;
