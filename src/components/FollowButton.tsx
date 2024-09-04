'use client';

import { FollowerInfo } from '@/lib/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import useFollowerInfo from '@/hooks/useFollowerInfo';
import kyInstance from '@/lib/ky';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FollowButtonProps {
   userId: string;
   initialState: FollowerInfo;
}

const FollowButton = ({ userId, initialState }: FollowButtonProps) => {
   const { data } = useFollowerInfo(userId, initialState);
   console.log('this is the data the I want to see', { ...data });
   const { toast } = useToast();

   const queryClient = useQueryClient();

   const queryKey: QueryKey = ['follower-info', userId];

   const { mutate } = useMutation({
      mutationFn: () =>
         data.isFollowedByUser
            ? kyInstance.delete(`/api/users/${userId}/followers`)
            : kyInstance.post(`/api/users/${userId}/followers`),
      onMutate: async () => {
         await queryClient.cancelQueries({ queryKey });
         const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);
         queryClient.setQueryData(queryKey, () => ({
            followers:
               (previousState?.followers || 0) +
               (previousState?.isFollowedByUser ? -1 : +1),
            isFollowedByUser: !previousState?.isFollowedByUser,
         }));
         return { previousState };
      },
      onError(error, _variables, context) {
         queryClient.setQueryData(queryKey, context?.previousState);
         console.error(error);
         toast({
            variant: 'destructive',
            description: 'Something went wrong. Please try again.',
         });
      },
   });

   return (
      <Button
         variant={data.isFollowedByUser ? 'secondary' : 'default'}
         onClick={() => mutate()}
      >
         {data.isFollowedByUser ? 'Unfollow' : 'Follow'}
      </Button>
   );
};

export default FollowButton;
