export const runtime = 'nodejs';

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({ take: 1 });
    return new Response(JSON.stringify({ success: true, data: posts }));
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}