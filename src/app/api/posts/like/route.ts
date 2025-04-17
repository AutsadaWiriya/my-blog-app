import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ liked: false }, { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ liked: false }, { status: 400 });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ liked: !!existingLike }, { status: 200 });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json({ liked: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if(!session){
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId  = session?.user?.id;

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
    }

    // Check if like already exists
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      // If like exists, remove it
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ message: "Like removed" }, { status: 200 });
    }

    // If like doesn't exist, create it
    const like = await prisma.like.create({
      data: {
        post: {
          connect: {
            id: postId
          }
        },
        user: {
          connect: {
            id: userId
          }
        },
      },
    });

    return NextResponse.json({ message: "Post liked", like }, { status: 201 });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}