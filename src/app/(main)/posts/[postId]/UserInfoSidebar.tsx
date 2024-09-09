import { validateRequest } from '@/auth';
import FollowButton from '@/components/FollowButton';
import Linkify from '@/components/Linkify';
import UserAvatar from '@/components/UserAvatar';
import UserTooltip from '@/components/UserTooltip';
import { UserData } from '@/lib/types';
import { User } from 'lucide-react';
import Link from 'next/link';

interface UserInfoSidebarProps {
   user: UserData;
}

const UserInfoSidebar = async ({ user }: UserInfoSidebarProps) => {
   const { user: LoggedInUser } = await validateRequest();
   if (!LoggedInUser) return null;

   return (
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
         <div className="text-xl font-bold"> About This User</div>
         <UserTooltip user={user}>
            <Link
               href={`/users/${user.username}`}
               className="flex items-center gap-3"
            >
               <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
               <div>
                  <p className="line-clamp-1 break-all font-semibold hover:underline">
                     {user.displayName}
                  </p>
                  <p className="line-clamp-1 break-all text-muted-foreground">
                     @{user.username}
                  </p>
               </div>
            </Link>
         </UserTooltip>
         <Linkify>
            <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
               {user.bio}
            </div>
         </Linkify>
         {user.id !== LoggedInUser.id && (
            <FollowButton
               userId={user.id}
               initialState={{
                  followers: user._count.followers,
                  isFollowedByUser: user.followers.some(
                     ({ followerId }) => followerId === LoggedInUser.id,
                  ),
               }}
            />
         )}
      </div>
   );
};

export default UserInfoSidebar;
