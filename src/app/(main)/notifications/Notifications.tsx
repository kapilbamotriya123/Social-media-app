'use client';

import {
   useInfiniteQuery,
   useMutation,
   useQueryClient,
} from '@tanstack/react-query';
import { PostPage, type NotificationsPage } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Notification from './Notification';
import kyInstance from '@/lib/ky';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import PostLoadingSkeleton from '@/components/posts/PostLoadingSkeleton';
import { useEffect } from 'react';

const Notifications = () => {
   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
   } = useInfiniteQuery({
      queryKey: ['notifications'],
      queryFn: ({ pageParam }) =>
         kyInstance
            .get(
               '/api/notifications',
               pageParam ? { searchParams: { cursor: pageParam } } : {},
            )
            .json<NotificationsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
   });

   const queryClient = useQueryClient();

   const { mutate } = useMutation({
      mutationFn: () => kyInstance.patch('/api/notifications/mark-as-read'),
      onSuccess: () => {
         queryClient.setQueryData(['notifications-unread-count'], {
            unreadCount: 0,
         });
      },
      onError: () => {
         console.error(
            'An error occurred while marking notifications as read.',
         );
      },
   });

   useEffect(() => {
    mutate()
   }, [mutate])

   const notifications =
      data?.pages.flatMap((page) => page.notifications) || [];

   if (status === 'pending') {
      return <PostLoadingSkeleton />;
   }

   if (status === 'success' && !notifications.length && !hasNextPage) {
      return (
         <p className="text-center text-muted-foreground">
            you dont have any notifications yet.
         </p>
      );
   }

   if (status === 'error') {
      return (
         <p className="text-center text-destructive">
            An error occurred while loading notifications.
         </p>
      );
   }

   return (
      <InfiniteScrollContainer
         className="space-y-5"
         onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
         {notifications.map((notification) => (
            <Notification notification={notification} key={notification.id} />
         ))}
         {isFetchingNextPage && (
            <Loader2 className="mx-auto my-3 animate-spin" />
         )}
      </InfiniteScrollContainer>
   );
};
export default Notifications;
