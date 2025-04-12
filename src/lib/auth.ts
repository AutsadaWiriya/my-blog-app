import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { signInZod } from "./schema";
import bcrypt from "bcryptjs";

const adapter = PrismaAdapter(prisma);
export const { auth, handlers, signIn } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  adapter,
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedCredentials = signInZod.parse(credentials);

        console.log(validatedCredentials);

        const user = await prisma.user.findUnique({
          where: {
            email: validatedCredentials.email,
          },
        });

        if (
          user &&
          user.password &&
          (await bcrypt.compare(validatedCredentials.password, user.password))
        ) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } else {
          return new Error("Invalid credentials");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    }
  }
});
