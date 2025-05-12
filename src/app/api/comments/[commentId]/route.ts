import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateCommentZod } from "@/lib/schema";
import { NextResponse } from "next/server";

interface Params {
  params: {
    commentId: string;
  };
}

// Update a comment
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const commentId = params.commentId;
    
    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!existingComment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to update the comment
    if (existingComment.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to update this comment" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateCommentZod.safeParse({ 
      commentId, 
      ...body 
    });

    if (!validatedData.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validatedData.error.format() },
        { status: 400 }
      );
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: validatedData.data.content,
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
      { message: "Comment updated successfully", data: updatedComment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { message: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// Delete a comment
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const commentId = params.commentId;
    
    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!existingComment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to delete the comment
    const isAdmin = (session.user as any)?.role === "admin";
    if (existingComment.userId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { message: "You are not authorized to delete this comment" },
        { status: 403 }
      );
    }

    // Delete the comment
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Failed to delete comment" },
      { status: 500 }
    );
  }
} 