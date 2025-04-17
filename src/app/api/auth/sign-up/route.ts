import { signUpZod } from "@/lib/schema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const zodParse = signUpZod.safeParse(body);
    if (!zodParse.success) {
      return NextResponse.json({
        error: "Invalid data",
        data: zodParse.error,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: zodParse.data.email,
      },
    });

    if (existingUser) {
      return NextResponse.json({
        error: "User already exists",
      }, { status: 400 });
    }

    const hashPassword = await bcrypt.hash(zodParse.data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: zodParse.data.email,
        password: hashPassword,
        name: zodParse.data.name,
      },
    });

    return NextResponse.json({
      message: "Success",
      data: newUser,
    });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong", data: error });
  }
}
