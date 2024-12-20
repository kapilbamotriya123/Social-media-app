'use client';

import { PostData } from '@/lib/types';
import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar';
import { formatRelativeDate } from '@/lib/relativeDate';
import { useSessionContext } from '@/app/(main)/SessionContextProvider';
import PostMoreButton from '@/components/posts/PostMoreButton';
import Linkify from '@/components/Linkify';
import UserTooltip from '@/components/UserTooltip';
import { Media } from '@prisma/client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import LikeButton from '@/app/(main)/posts/[postId]/LikeButton';
import { MessageSquare } from 'lucide-react';
import BookmarkButton from '@/app/(main)/posts/[postId]/BookmarkButton';
import { useState } from 'react';
import Comments from '../comments/Comments';

interface PostProps {
   post: PostData;
}

const Post = ({ post }: PostProps) => {
   const { user } = useSessionContext();

   const [showComments, setShowComments] = useState(false);

   return (
      <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
         <div className="flex justify-between gap-3">
            <div className="flex flex-shrink gap-3">
               <UserTooltip user={post.user}>
                  <Link href={`/users/${post.user.username}`}>
                     <UserAvatar avatarUrl={post.user.avatarUrl} />
                  </Link>
               </UserTooltip>
               <div>
                  <UserTooltip user={post.user}>
                     <Link
                        href={`/users/${post.user.username}`}
                        className="block font-medium hover:underline"
                     >
                        {post.user.displayName}
                     </Link>
                  </UserTooltip>
                  <Link
                     href={`/posts/${post.id}`}
                     className="block text-sm text-muted-foreground hover:underline"
                     suppressHydrationWarning
                  >
                     {formatRelativeDate(post.createdAt)}
                  </Link>
               </div>
            </div>
            {post.userId === user.id && (
               <PostMoreButton
                  post={post}
                  className="opacity-0 transition-opacity group-hover/post:opacity-100"
               />
            )}
         </div>
         <Linkify>
            <div className="whitespace-break-spaces break-words">
               {post.content}
            </div>
         </Linkify>
         {!!post.attachments && (
            <MediaPreviews attachments={post.attachments} />
         )}
         <hr className="text-muted-foreground" />
         <div className="flex justify-between gap-5">
            <div className="flex items-center gap-5">
               <LikeButton
                  postId={post.id}
                  initialState={{
                     likes: post._count.likes,
                     isLikedByUser: post.likes.some(
                        (like) => like.userId === user.id,
                     ),
                  }}
               />
               <CommentsButton
                  post={post}
                  onClick={() => {
                     setShowComments(!showComments);
                  }}
               />
            </div>
            <BookmarkButton
               postId={post.id}
               initialState={{
                  isBookmarkedByUser: post.bookmarks.some(
                     (bookmark) => bookmark.userId === user.id,
                  ),
               }}
            />
         </div>
         {showComments && <Comments post={post} />}
      </article>
   );
};

export default Post;

interface MediaPreviewsProps {
   attachments: Media[];
}

const MediaPreviews = ({ attachments }: MediaPreviewsProps) => {
   return (
      <div
         className={cn(
            'flex flex-col gap-3',
            attachments.length > 1 && 'sm:grid sm:grid-cols-2',
         )}
      >
         {attachments.map((a) => (
            <MediaPreview media={a} key={a.id} />
         ))}
      </div>
   );
};

interface MediaPreviewProps {
   media: Media;
}

const MediaPreview = ({ media }: MediaPreviewProps) => {
   if (media.type === 'IMAGE') {
      return (
         <Image
            src={media.url}
            alt={'attachment preview'}
            height={500}
            width={500}
            className="mx-auto size-fit max-h-[30rem] rounded-2xl"
         />
      );
   }
   if (media.type === 'VIDEO') {
      return (
         <div>
            <video
               src={media.url}
               controls
               className="mx-auto size-fit max-h-[30rem] rounded-2xl"
            />
         </div>
      );
   }

   return <p className="text-destructive">unsupported media type</p>;
};

interface CommentsButtonProps {
   post: PostData;
   onClick: () => void;
}

const CommentsButton = ({ post, onClick }: CommentsButtonProps) => {
   return (
      <button className="flex items-center gap-2" onClick={onClick}>
         <MessageSquare />
         <span className="text-sm font-medium tabular-nums">
            {post._count.comments}
         </span>
         <span className="hidden sm:inline">comments</span>
      </button>
   );
};
