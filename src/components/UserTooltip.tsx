'use client';

import { FollowerInfo, UserData } from '@/lib/types';
import React from 'react';
import { useSessionContext } from '@/app/(main)/SessionContextProvider';
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar';
import FollowButton from '@/components/FollowButton';
import Linkify from './Linkify';
import FollowerCount from '@/components/FollowerCount';

interface UserTooltipProps extends React.PropsWithChildren {
   user: UserData;
}

const UserTooltip = ({ children, user }: UserTooltipProps) => {
   const { user: loggedInUser } = useSessionContext();

   const followerInfo: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: user.followers.some(
         (follower) => follower.followerId === loggedInUser.id,
      ),
   };

   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent>
               <div className="rounded-2x flex max-w-80 flex-col gap-3 break-words px-1 py-2">
                  <div className="flex items-center justify-between gap-2">
                     <Link href={`/users/${user.username}`}>
                        <UserAvatar avatarUrl={user.avatarUrl} size={70} />
                     </Link>
                     {loggedInUser.id !== user.id && (
                        <FollowButton
                           userId={user.id}
                           initialState={followerInfo}
                        />
                     )}
                  </div>
                  <div>
                     <Link href={`users/${user.username}`}>
                        <div
                           className={'text-lg font-semibold hover:underline'}
                        >
                           {user.displayName}
                        </div>
                        <div className="text-muted-foreground">
                           @{user.username}
                        </div>
                     </Link>
                     {user.bio && (
                        <Linkify>
                           <div>{user.bio}</div>
                        </Linkify>
                     )}
                  </div>
               </div>
               <FollowerCount userId={user.id} initialState={followerInfo} />
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
};

export default UserTooltip;
