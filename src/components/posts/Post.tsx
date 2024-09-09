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
import AttachmentPreviews from './editor/AttachmentsPreview';

interface PostProps {
   post: PostData;
}

const Post = ({ post }: PostProps) => {
   const { user } = useSessionContext();

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
                     href={`posts/${post.id}`}
                     className="block text-sm text-muted-foreground hover:underline"
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
         {!!post.attachments && <MediaPreviews attachments={post.attachments} />}
      </article>
   );
};

export default Post;

interface MediaPreviewsProps {
   attachments: Media[];
}

const MediaPreviews =  ({attachments} : MediaPreviewsProps) => {
   return (
      <div className={cn('flex flex-col gap-3', attachments.length > 1 && 'sm:grid sm:grid-cols-2')}>
         {attachments.map(a => (
            <MediaPreview media={a} key={a.id} />
         ))}
      </div>
   )
}

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
            className="mx-auto size-fit rounded-2xl max-h-[30rem]"
         />
      );
   }
   if (media.type === 'VIDEO') {
      return <div>
      <video src={media.url} controls className='mx-auto size-fit rounded-2xl max-h-[30rem]' />
   </div>
      
   }

   return <p className='text-destructive'>unsupported media type</p>
};

