"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/app/(auth)/sign-up/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();

  return (
    <form
      id="signin-form"
      action={async (formData: FormData) => {
        const result = await signUp(formData);
        
        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success("Account created successfully");
        router.push("/sign-in");
      }}
    >
      <div className="grid gap-4 w-full">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
          />
        </div>
        <Button type="submit" form="signin-form" className="w-full mt-3">
          Sign Up
        </Button>
      </div>
    </form>
  );
}