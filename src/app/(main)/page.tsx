import PostEditor from '@/components/posts/editor/PostEditor';

import TrendsSidebar from '@/components/TrendingsSideBar/TrendsSidebar';
import ForYouFeed from '@/app/(main)/ForYouFeed';

const Home = async () => {
  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <div>
        <TrendsSidebar />
      </div>
    </div>
  );
};

export default Home;
