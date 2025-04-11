import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { signUpZod } from "./schema";
import bcrypt from "bcryptjs";

const adapter = PrismaAdapter(prisma);
export const { auth, handlers } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  adapter,
  providers: [
    Google,
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedCredentials = signUpZod.parse(credentials);

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
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    }
  }
});
