import TrendsSidebar from '@/components/TrendingsSideBar/TrendsSidebar';
import type { Metadata } from 'next';
import Notifications from './Notifications';

export const metadata = (): Metadata => {
   return {
      title: 'notifications',
   };
};

const Page = () => {
   return (
      <main className="flex w-full min-w-0 gap-5">
         <div className="w-full min-w-0 space-y-5">
            <div className="text-center text-2xl font-bold">
               <h1>Notifications</h1>
            </div>
            <Notifications />
         </div>
         <TrendsSidebar />
      </main>
   );
};

export default Page;
