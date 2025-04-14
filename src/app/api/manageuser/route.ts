import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { managerDeleteZod, managerPutZod } from "@/lib/schema";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      (session.user as any)?.role !== "manager" &&
      (session.user as any)?.role !== "admin"
    ) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
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

    const total = await prisma.user.count();
    const totalPages = Math.ceil(total / limit);

    return Response.json({
      page,
      limit,
      total,
      totalPages,
      users,
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserRole = (session.user as any)?.role;
    if (currentUserRole !== "manager" && currentUserRole !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const validation = managerPutZod.safeParse(data);
    if (!validation.success) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: validation.data?.userId },
      select: { role: true },
    });

    if (!targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Role update permission logic
    if (currentUserRole === "manager") {
      if (targetUser.role === "admin" || validation.data?.newRole === "admin") {
        return Response.json(
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

    return Response.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserRole = (session.user as any)?.role;
    if (currentUserRole !== "manager" && currentUserRole !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const validation = managerDeleteZod.safeParse(data);
    if (!validation.success) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: validation.data?.userId },
      select: { role: true },
    });

    if (!targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check deletion permissions
    if (currentUserRole === "manager") {
      if (targetUser.role !== "member") {
        return Response.json(
          { error: "Managers can only delete members" },
          { status: 403 }
        );
      }
    }

    await prisma.user.delete({
      where: { id: validation.data?.userId },
    });

    return Response.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
