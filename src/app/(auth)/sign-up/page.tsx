import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleSignIn, GithubSignIn } from "@/components/socials-sign-in";
import SignUpForm from "@/components/auth/SignUpForm";

import { auth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import Link from "next/link";

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
              <SignUpForm />
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
