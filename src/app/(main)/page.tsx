import PostEditor from '@/components/posts/editor/PostEditor';
import prisma from '@/lib/prisma';
import Post from '@/components/posts/Post';
import { PostDataInclude } from '@/lib/types';

const Home = async () => {
  const posts = await prisma.post.findMany({
    include: PostDataInclude
  });

  return (
    <div className="h-[200vh] w-full bg-red-50">
      <div className="w-full p-5">
        <PostEditor />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
