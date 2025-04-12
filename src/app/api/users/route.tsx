import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateUserZod } from "@/lib/schema";

export async function PUT(response: Response) {
  try {
    const session = await auth();

    if (!session?.user)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const currentUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });

    if (!currentUser)
      return Response.json({ error: "User not found" }, { status: 404 });

    const data = await response.json();
    const validation = updateUserZod.safeParse(data);

    if (!validation.success) {
      return Response.json(
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
      where: { id: validation.data.id },
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

    return Response.json(
      { message: "User updated successfully", data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
    return Response.json(
      { error: "Failed to update", data: error },
      { status: 500 }
    );
  }
}
