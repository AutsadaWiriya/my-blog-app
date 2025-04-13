import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignIn, GithubSignIn } from "@/components/socials-sign-in";

import { auth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import Link from "next/link";

interface SignInFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const page = async () => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <>
      <div className="px-12">
        <div className="flex justify-center mt-16">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <GoogleSignIn />
                <GithubSignIn />
              </div>
              <Separator />
              <form
                id="signin-form"
                action={async (formData: FormData) => {
                  "use server";
                  const password = formData.get("password");
                  const confirmPassword = formData.get("confirmPassword");

                  if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                  }

                  const formDataObj: Partial<SignInFormData> = {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    password: formData.get("password") as string,
                  };

                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/sign-up`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(formDataObj),
                    }
                  );

                  if (!response.ok) {
                    throw new Error("Failed to sign up");
                  }

                  redirect("/sign-in");
                }}
              >
                <div className="grid gap-4 w-full">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" type="text" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                    />
                  </div>
                  <Button
                    type="submit"
                    form="signin-form"
                    className="w-full mt-3"
                  >
                    Sign Up
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <p className="text-sm text-center">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default page;
