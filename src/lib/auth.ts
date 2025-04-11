import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const adapter = PrismaAdapter(prisma);
export const { auth, handlers } = NextAuth({ adapter, providers: [] });
