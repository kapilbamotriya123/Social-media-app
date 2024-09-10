'use client';

import { Button } from '@/components/ui/button';
import kyInstance from '@/lib/ky';
import type { NotificationUnreadCount } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import Link from 'next/link';

interface NotificationButtonProps {
   initialState: NotificationUnreadCount;
}

const NotificationButton = ({ initialState }: NotificationButtonProps) => {
   const { data } = useQuery({
      queryKey: ['notifications-unread-count'],
      queryFn: () =>
         kyInstance
            .get('/api/notifications/unread-count')
            .json<NotificationUnreadCount>(),
      initialData: initialState,
      refetchInterval: 60000,
   });

   return (
      <Button
         variant="ghost"
         className="flex items-center justify-start gap-3"
         title="Notifications "
         asChild
      >
         <Link href="/notifications">
            <div className="relative">
               {!!data.unreadCount && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-primary-foreground tabular-nums">
                     {data.unreadCount}
                  </span>
               )}
               <Bell />
            </div>
            <span className="hidden lg:inline">Notifications </span>
         </Link>
      </Button>
   );
};

export default NotificationButton;
