import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import WhoToFollow from './WhoToFollow';
import TrendingTopics from '@/components/TrendingsSideBar/TrendingTopics';

const TrendsSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:max-w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
};

export default TrendsSidebar;
