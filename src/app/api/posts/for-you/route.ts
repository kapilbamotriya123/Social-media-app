import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { postDataInclude, PostPage } from '@/lib/types';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined;

    const pageSize = 10;

    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // let createdAt;
    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: { createdAt: 'desc' },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostPage = {
      posts: posts.slice(0, pageSize),
      nextCursor
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'internal server error' }, { status: 500 });
  }
};
