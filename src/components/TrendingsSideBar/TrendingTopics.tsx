import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';
import Link from 'next/link';

//what this does is it render a table with hashtag order by their count with a sql query &&
// put it in a cache (server side) which gets revalidated every 3 hours we can fetch it with the function

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
    SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) as hashtag, COUNT(*) AS count
    FROM posts 
    GROUP BY (hashtag)
    ORDER BY count DESC, hashtag ASC
    LIMIT 5
    `;
    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count)
    }));
  },
  ['trending-topics'],
  { revalidate: 60 * 60 * 3 }
);

const TrendingTopics = async () => {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending Topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split('#')[1];
        return (
          <Link href={`/hashtags/${title}`} key={hashtag} className="block">
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {hashtag}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              {count} {count === 1 ? 'post' : 'posts'}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default TrendingTopics;
