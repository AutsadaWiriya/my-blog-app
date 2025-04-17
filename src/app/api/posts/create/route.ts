import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPostZod } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ message: 'failed', data: 'Unauthorized', status: 401 });
    }

    const body = await request.json();
    const validateBody = createPostZod.safeParse(body);
    if (!validateBody.success) {
      return Response.json({ message: 'failed', data: validateBody.error, status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        content: validateBody.data.content,
        user: {
          connect: { id: session.user.id },
        },
      },
    });

    return Response.json({ message: 'success', data: post, status: 201 });

  } catch (error) {
    console.error(error);
    return Response.json({ message: 'failed', data: 'Internal Server Error', status: 500 });
  }
}