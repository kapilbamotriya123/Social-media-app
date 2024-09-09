import TrendsSidebar from '@/components/TrendingsSideBar/TrendsSidebar';
import type { Metadata } from 'next';
import BookmarksFeed from './BookmarksFeed';

export const metadata = (): Metadata => {
   return {
      title: 'Bookmarks',
   };
};

const BookmarksPage = () => {
   return (
      <main className="flex w-full min-w-0 gap-5">
         <div className="w-full min-w-0 space-y-5">
            <div className="text-center text-2xl font-bold">
               <h1>Bookmarks</h1>
            </div>
            <BookmarksFeed />
         </div>
         <TrendsSidebar />
      </main>
   );
};

export default BookmarksPage;
