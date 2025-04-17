import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPostZod } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'failed', data: 'Unauthorized', status: 401 });
    }

    const body = await request.json();
    const validateBody = createPostZod.safeParse(body);
    if (!validateBody.success) {
      return NextResponse.json({ message: 'failed', data: validateBody.error, status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        content: validateBody.data.content,
        user: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json({ message: 'success', data: post, status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'failed', data: 'Internal Server Error', status: 500 });
  }
}