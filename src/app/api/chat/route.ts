import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1).max(500),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!session.user.id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = messageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validation.error.format() },
        { status: 400 }
      );
    }

    // Create message in database
    const message = await prisma.message.create({
      data: {
        content: validation.data.content,
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

    console.log("Message created in database:", message.id);

    // Trigger Pusher event if pusher is configured
    if (pusher) {
      try {
        await pusher.trigger("chat", "new-message", message);
        console.log("Pusher event triggered for message:", message.id);
      } catch (error) {
        console.error("Error triggering Pusher event:", error);
        // Continue even if Pusher fails
      }
    } else {
      console.warn("Pusher is not configured. Skipping real-time update.");
    }

    return NextResponse.json(
      { message: "Message sent successfully", data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("Fetching messages from database");
    // Get the most recent 50 messages
    const messages = await prisma.message.findMany({
      take: 50,
      orderBy: {
        createdAt: "desc",
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

    console.log(`Found ${messages.length} messages`);
    
    return NextResponse.json(
      { messages: messages.reverse() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
} 