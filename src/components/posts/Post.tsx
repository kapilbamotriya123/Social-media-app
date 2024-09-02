import { PostData } from '@/lib/types';

interface PostProps {
  post: PostData;
}

const Post = ({ post }: PostProps) => {
  return <article>{post.content}</article>;
};

export default Post;
