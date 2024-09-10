import type { CommentsData } from '@/lib/types';
import UserTooltip from '../UserTooltip';
import UserAvatar from '../UserAvatar';
import Link from 'next/link';
import { formatRelativeDate } from '@/lib/relativeDate';
import { useSessionContext } from '@/app/(main)/SessionContextProvider';
import CommentMoreButton from './CommentMoreButton';

interface CommentProps {
   comment: CommentsData;
}

const Comment = ({ comment }: CommentProps) => {

    const {user} = useSessionContext();

   return (
      <div className="flex gap-3 py-3 group/comment">
         <span className="hidden sm:inline">
            <UserTooltip user={comment.user}>
               <Link href={`/users/${comment.user.username}`}>
                  <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
               </Link>
            </UserTooltip>
         </span>
         <div>
            <div className="flex items-center gap-1 text-sm">
               <UserTooltip user={comment.user}>
                  <Link
                     href={`/users/${comment.user.username}`}
                     className="font-medium hover:underline"
                  >
                     {comment.user.displayName}
                  </Link>
               </UserTooltip>
               <span className="text-muted-foreground">
                  {formatRelativeDate(comment.createdAt)}
               </span>
            </div>
            {comment.content}
         </div>
         {comment.user.id === user.id && (
            <CommentMoreButton comment={comment} className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100" />
         )}
      </div>
   );
};

export default Comment;
