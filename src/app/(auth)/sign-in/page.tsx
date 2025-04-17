import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleSignIn, GithubSignIn } from "@/components/socials-sign-in";

import { auth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import Link from "next/link";
import ClientForm from "@/components/auth/ClientForm";

const page = async () => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <>
      <div className="px-12">
        <div className="flex justify-center mt-16">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <GoogleSignIn />
                <GithubSignIn />
              </div>
              <Separator />
              <ClientForm />
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <p className="text-sm text-center">
                  Don't have an account?{" "}
                  <Link href="/sign-up" className="underline">
                    Sign Up
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
