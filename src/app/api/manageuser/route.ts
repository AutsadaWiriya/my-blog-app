import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { managerDeleteZod, managerPutZod } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      (session.user as any)?.role !== "manager" &&
      (session.user as any)?.role !== "admin"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await prisma.user.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages,
      users,
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserRole = (session.user as any)?.role;
    if (currentUserRole !== "manager" && currentUserRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const validation = managerPutZod.safeParse(data);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: validation.data?.userId },
      select: { role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Role update permission logic
    if (currentUserRole === "manager") {
      if (targetUser.role === "admin" || validation.data?.newRole === "admin") {
        return NextResponse.json(
          { error: "Managers cannot modify admin roles" },
          { status: 403 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: validation.data?.userId },
      data: { role: validation.data?.newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserRole = (session.user as any)?.role;
    if (currentUserRole !== "manager" && currentUserRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const validation = managerDeleteZod.safeParse(data);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: validation.data?.userId },
      select: { role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check deletion permissions
    if (currentUserRole === "manager") {
      if (targetUser.role !== "member") {
        return NextResponse.json(
          { error: "Managers can only delete members" },
          { status: 403 }
        );
      }
    }

    await prisma.user.delete({
      where: { id: validation.data?.userId },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
