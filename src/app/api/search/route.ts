import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, type PostPage } from "@/lib/types";
import type { NextRequest } from "next/server";

export const GET = async (req: NextRequest) =>{
    try {
      const q = req.nextUrl.searchParams.get("q") || "";
      const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
  
      const searchQuery = q.split(" ").join(" & ");
  
      const pageSize = 10;
  
      const { user } = await validateRequest();
  
      if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              content: {
                search: searchQuery,
              },
            },
            {
              user: {
                displayName: {
                  search: searchQuery,
                },
              },
            },
            {
              user: {
                username: {
                  search: searchQuery,
                },
              },
            },
          ],
        },
        include: getPostDataInclude(user.id),
        orderBy: { createdAt: "desc" },
        take: pageSize + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });
  
      const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;
  
      const data: PostPage = {
        posts: posts.slice(0, pageSize),
        nextCursor,
      };
  
      return Response.json(data);
    } catch (error) {
      console.error(error);
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  }