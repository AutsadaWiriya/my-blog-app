import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const cursor = searchParams.get("cursor"); // postId ตัวสุดท้าย
    const limit = 15;

    const posts = await prisma.post.findMany({
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const hasNextPage = posts.length > limit;
    const data = hasNextPage ? posts.slice(0, -1) : posts;

    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return NextResponse.json({
      message: "success",
      posts: data,
      nextCursor,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}