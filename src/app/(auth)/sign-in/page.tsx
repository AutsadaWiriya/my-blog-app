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

import { signIn } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";

const page = () => {
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
            <form
              id="signin-form"
              action={async (formData: FormData) => {
                "use server";
                await signIn("credentials", formData);
              }}
            >
              <div className="grid gap-4 w-full">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" form="signin-form" className="w-full">
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
    </>
  );
};

export default page;
