import { cache } from 'react';
import prisma from '@/lib/prisma';
import { FollowerInfo, getUserDataSelect, UserData } from '@/lib/types';
import { validateRequest } from '@/auth';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TrendsSidebar from '@/components/TrendingsSideBar/TrendsSidebar';
import UserAvatar from '@/components/UserAvatar';
import { formatDate } from 'date-fns';
import FollowerCount from '@/components/FollowerCount';
import { Button } from '@/components/ui/button';
import FollowButton from '@/components/FollowButton';

interface PageProps {
   params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
   const user = await prisma.user.findFirst({
      where: {
         username: {
            equals: username,
            mode: 'insensitive',
         },
      },
      select: getUserDataSelect(loggedInUserId),
   });

   if (!user) notFound();

   return user;
});

export const generateMetadata = async ({
   params: { username },
}: PageProps): Promise<Metadata> => {
   const { user: loggedInUser } = await validateRequest();

   if (!loggedInUser) return {};

   const user = await getUser(username, loggedInUser.id);

   return {
      title: `${user.displayName} (${user.username})`,
   };
};

const UserPage = async ({ params: { username } }: PageProps) => {
   const { user: loggedInUser } = await validateRequest();
   if (!loggedInUser) {
      return <p>you are not authorized to view this page</p>;
   }

   const user = await getUser(username, loggedInUser.id);

   return (
      <main className="flex w-full min-w-0 gap-5">
         <div className={'w-full min-w-0 space-y-5'}>
            <UserProfile user={user} loggedInUserId={loggedInUser.id} />
         </div>

         <TrendsSidebar />
      </main>
   );
};

export default UserPage;

//here we will define the component user profile which will be responsible for diplaying user info
interface UserProfileProps {
   user: UserData;
   loggedInUserId: string;
}

const UserProfile = ({ user, loggedInUserId }: UserProfileProps) => {
   //we need the follower info so we will fetch that first
   const followerInfo: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: user.followers.some(
         (follower) => follower.followerId === loggedInUserId,
      ),
   };

   //now we will start building the profile of the user

   return (
      <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
         <UserAvatar
            avatarUrl={user.avatarUrl}
            size={250}
            className={'mx-auto size-full max-h-60 max-w-60 rounded-full'}
         />
         <div className="flex flex-wrap gap-3 sm:flex-nowrap">
            <div className="me-auto space-y-5">
               <div>
                  <h1 className="text-3xl font-bold">{user.displayName}</h1>
                  <div className="text-muted-foreground">@{user.username}</div>
                  <div className="mt-1">
                     Member since {formatDate(user.createdAt, 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-3">
                     <span>
                        Post:{' '}
                        <span className={'font-bold'}>{user._count.posts}</span>
                     </span>
                     <FollowerCount
                        userId={user.id}
                        initialState={followerInfo}
                     />
                  </div>
               </div>
            </div>
            {user.id === loggedInUserId && <Button>Edit Profile</Button>}
            {user.id !== loggedInUserId && (
               <FollowButton userId={user.id} initialState={followerInfo} />
            )}
         </div>
         {user.bio && (
            <>
               <hr />
               <div className="overflow-hidden whitespace-pre-line break-words">
                  {user.bio}
               </div>
            </>
         )}
      </div>
   );
};
