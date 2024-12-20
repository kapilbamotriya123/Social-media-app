import { Prisma } from '@prisma/client';

export const getUserDataSelect = (loggedInUserId: string) => {
   return {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      createdAt: true,
      avatarUrl: true,
      followers: {
         where: {
            followerId: loggedInUserId,
         },
         select: {
            followerId: true,
         },
      },
      _count: {
         select: {
            followers: true,
            posts: true,
         },
      },
   } satisfies Prisma.UserSelect;
};

export type UserData = Prisma.UserGetPayload<{
   select: ReturnType<typeof getUserDataSelect>;
}>;

export const getPostDataInclude = (loggedInUserId: string) => {
   return {
      user: {
         select: getUserDataSelect(loggedInUserId),
      },
      attachments: true,
      likes: {
         where: {
            userId: loggedInUserId,
         },
         select: {
            userId: true,
         },
      },
      bookmarks: {
         where: {
            userId: loggedInUserId,
         },
         select: {
            userId: true,
         },
      },
      _count: {
         select: {
            likes: true,
            comments: true
         },
      },
   } satisfies Prisma.PostInclude;
};

export type PostData = Prisma.PostGetPayload<{
   include: ReturnType<typeof getPostDataInclude>;
}>;

//this is to get the comments data of to show which has commented on the post 
export const getCommentsDataInclude = (loggedInUserId:string) => {
   return {
      user: {
         select: getUserDataSelect(loggedInUserId)
      }
   } satisfies Prisma.CommentsInclude
}

export type CommentsData = Prisma.CommentsGetPayload<{
   include: ReturnType<typeof getCommentsDataInclude>
}>

//this for the comments page which will also have a prev cursor to render the pre comments 
export interface CommentsPage {
   comments: CommentsData[]
   previousCursor: string | null
}

export const notificationsInclude = {
   issuer: {
      select: {
         username: true,
         displayName: true,
         avatarUrl: true
      }
   },
   post: {
      select: {
         content: true
      }
   }
} satisfies Prisma.NotificationInclude

export type NotificationData  = Prisma.NotificationGetPayload<{
   include: typeof notificationsInclude
}>


export interface NotificationsPage {
   notifications: NotificationData[],
   nextCursor: string | null
}

export interface PostPage {
   posts: PostData[];
   nextCursor: string | null;
}

export interface FollowerInfo {
   followers: number;
   isFollowedByUser: boolean;
}

export interface LikesInfo {
   likes: number;
   isLikedByUser: boolean;
}

export interface BookmarkInfo {
   isBookmarkedByUser: boolean;
}


export interface NotificationUnreadCount {
   unreadCount: number
}