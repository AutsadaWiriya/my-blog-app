import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateUserZod } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const currentUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });

    if (!currentUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const data = await request.json();
    const validation = updateUserZod.safeParse(data);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", data: validation.error },
        { status: 400 }
      );
    }

    const name = validation.data.name?.trim();
    const image = validation.data.image?.trim();

    if (!name || !image) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session?.user?.id },
      data: {
        name: validation.data.name || undefined,
        image: validation.data.image || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "User updated successfully", data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: "Failed to update", data: error },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const currentUser = await prisma.user.deleteMany({
      where: { id: session?.user?.id },
    });

    return NextResponse.json(
      { message: "User deleted successfully", currentUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete", data: error },
      { status: 500 }
    );
  }
}