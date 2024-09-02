import { PostData } from '@/lib/types';
import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar';
import { formatRelativeDate } from '@/lib/relativeDate';

interface PostProps {
  post: PostData;
}

const Post = ({ post }: PostProps) => {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-shrink gap-3">
        <Link href={`/users/${post.user.username}`}>
          <UserAvatar avatarUrl={post.user.avatarUrl} />
        </Link>
        <div>
          <Link
            href={`/users/${post.user.username}`}
            className="block font-medium hover:underline"
          >
            {post.user.displayName}
          </Link>
          <Link
            href={`posts/${post.id}`}
            className="block text-sm text-muted-foreground hover:underline"
          >
            {/*{formatRelativeDate(post.createdAt)}*/}
          </Link>
        </div>
      </div>
      <div className="whitespace-break-spaces break-words">{post.content}</div>
    </article>
  );
};

export default Post;
