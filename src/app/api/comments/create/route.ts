import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCommentZod } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure user ID exists
    if (!session.user.id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = createCommentZod.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validatedData.error.format() },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: {
        id: validatedData.data.postId,
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.data.content,
        postId: validatedData.data.postId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Comment created successfully", data: comment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Failed to create comment" },
      { status: 500 }
    );
  }
} 