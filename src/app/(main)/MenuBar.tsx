import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bell, Bookmark, Home, Mail } from 'lucide-react';
import NotificationButton from './NotificationButton';
import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import UserAvatar from '@/components/UserAvatar';

interface MenuBarProps {
   className?: string;
   userAvatar?: string | null
}

const MenuBar = async ({ className, userAvatar }: MenuBarProps) => {
   const { user } = await validateRequest();

   if (!user) return null;

   const unreadCount = await prisma.notification.count({
      where: {
         recipientId: user.id,
         read: false,
      },
   });  
   

   return (
      <div className={className}>
         <Button
            variant="ghost"
            className="flex items-center justify-start gap-3"
            title="Home"
            asChild
         >
            <Link href="/">
               <Home />
               <span className="hidden lg:inline">Home</span>
            </Link>
         </Button>
         <NotificationButton initialState={{unreadCount}} />

         <Button
            variant="ghost"
            className="flex items-center justify-start gap-3"
            title="Bookmarks"
            asChild
         >
            <Link href="/bookmarks">
               <Bookmark />
               <span className="hidden lg:inline">BookMarks</span>
            </Link>
         </Button>
         <Button
            variant="ghost"
            className="flex items-center justify-start gap-3"
            title="profile"
            asChild
         >
            <Link href="/messages">
               <UserAvatar avatarUrl={userAvatar}  size={30}/>
               <span className="hidden lg:inline">Profile</span>
            </Link>
         </Button>
      </div>
   );
};

export default MenuBar;
