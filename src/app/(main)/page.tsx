import PostEditor from '@/components/posts/editor/PostEditor';

import TrendsSidebar from '@/components/TrendingsSideBar/TrendsSidebar';
import ForYouFeed from '@/app/(main)/ForYouFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Following from '@/app/(main)/Following';

const Home = async () => {
   return (
      <div className="flex w-full min-w-0 gap-5">
         <div className="w-full min-w-0 space-y-5">
            <PostEditor />
            <Tabs defaultValue="for-you">
               <TabsList>
                  <TabsTrigger value="for-you">For You</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
               </TabsList>
               <TabsContent value="for-you">
                  <ForYouFeed />
               </TabsContent>
               <TabsContent value="following">
                  <Following />
               </TabsContent>
            </Tabs>
         </div>
         <div>
            <TrendsSidebar />
         </div>
      </div>
   );
};

export default Home;
