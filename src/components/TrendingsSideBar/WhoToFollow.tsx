import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';

import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar';
import FollowButton from '../FollowButton';
import { getUserDataSelect } from '@/lib/types';
import UserTooltip from '@/components/UserTooltip';

const WhoToFollow = async () => {
   const { user: loggedInUser } = await validateRequest();
   if (!loggedInUser) return null;
   //when we are getting a users info I want to add the followers and if I am following him or not which should be done in include so we will change include

   const usersToFollow = await prisma.user.findMany({
      where: {
         NOT: {
            id: loggedInUser.id,
         },
         followers: {
            none: {
               followerId: loggedInUser.id,
            },
         },
      },
      select: getUserDataSelect(loggedInUser.id),
      take: 5,
   });

   return (
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
         <div className="text-xl font-bold">Who to follow</div>
         {usersToFollow.map((user) => (
            <div
               key={user.id}
               className="flex items-center justify-between gap-3"
            >
               <UserTooltip user={user}>
                  <Link
                     href={`/users/${user.username}`}
                     className="flex items-center gap-3"
                  >
                     <UserAvatar
                        avatarUrl={user.avatarUrl}
                        className="flex-none"
                     />
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
               <FollowButton
                  userId={user.id}
                  initialState={{
                     followers: user._count.followers,
                     isFollowedByUser: user.followers.some(
                        ({ followerId }) => followerId === user.id,
                     ),
                  }}
               />
            </div>
         ))}
      </div>
   );
};

export default WhoToFollow;
