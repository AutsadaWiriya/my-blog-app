"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authenticate } from "@/app/(auth)/sign-in/actions";
import { toast } from "sonner";

export default function ClientForm() {
  return (
    <form
      id="signin-form"
      action={async (formData: FormData) => {
        const result = await authenticate(formData);
        if (result?.error) {
          toast.error(result.error);
        }
      }}
    >
      <div className="grid gap-4 w-full">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" form="signin-form" className="w-full mt-3">
          Sign In
        </Button>
      </div>
    </form>
  );
}