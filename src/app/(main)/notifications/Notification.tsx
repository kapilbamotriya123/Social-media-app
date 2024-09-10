import UserAvatar from '@/components/UserAvatar';
import { formatRelativeDate } from '@/lib/relativeDate';
import type { NotificationData } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { NotificationType } from '@prisma/client';
import { Heart, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';

interface NotificationProps {
   notification: NotificationData;
}

const Notification = ({ notification }: NotificationProps) => {


   const notificationTypeMap: Record<
      NotificationType,
      { message: string; icon: JSX.Element; href: string }
   > = {
      FOLLOW: {
         message:  `followed you`,
         icon: <User className="size-7 text-primary" />,
         href: `/users/${notification.issuer.username}`,
      },
      LIKE: {
         message:  `liked your post`,
         icon: <Heart className="size-7 fill-red-500 text-red-500" />,
         href: `/posts/${notification.postId}`,
      },
      COMMENT: {
         message: `commented on your post`,
         icon: <MessageCircle className="size-7 text-primary" />,
         href: `/posts/${notification.postId}`,
      },
   };
   
   const { message, icon, href } = notificationTypeMap[notification.type];

   return (
      <Link href={href} className="block">
         <article
            className={cn(
                'flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/80 relative',
                !notification.read && 'bg-primary/10',
                
            )}
         >
            <div className="my-1">{icon}</div>
            <div className="space-y-5">
               <UserAvatar
                  avatarUrl={notification.issuer.avatarUrl}
                  size={36}
               />
               <div>
                  <span className="font-bold">
                     {notification.issuer.displayName}
                  </span>{' '}
                  <span>{message}</span>
               </div>
               {notification.post  && (
                <div className='line-clamp-3 whitespace-pre-line text-muted-foreground'>
                    {notification.post.content}
                </div>
               )}
            </div>
            <span className=' text-muted-foreground absolute right-3'>{formatRelativeDate(notification.createdAt)}</span>
         </article>
      </Link>
   );
};

export default Notification;
