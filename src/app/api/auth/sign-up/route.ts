import { signUpZod } from "@/lib/schema";
import { prisma } from "@/lib/prisma";
import  bcrypt  from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const zodParse = signUpZod.safeParse(body);
    if (!zodParse.success) {
      return Response.json({
        error: "Invalid data",
        data: zodParse.error,
      });
    }

    const hashPassword = await bcrypt.hash(zodParse.data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: zodParse.data.email,
        password: hashPassword,
        name: zodParse.data.name,
      },
    });

    return Response.json({
      message: "Success",
      data: newUser
    });

  } catch (error) {
    return Response.json({ error: "Something went wrong", data: error });
  }
}
