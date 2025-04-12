import { SignOut } from "@/components/sign-out";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";

interface User {
  email?: string;
  name?: string;
  role?: string;
}

const Page = async () => {
  const session = await auth();
  const user = session?.user as User;

  return (
    <div className="">
      {session ? (
        <>
          <p>Signed in as:</p>
          <div>Email: {user.email}</div>
          <div>Name: {user.name}</div>
          <div>Role: {user.role}</div>
          <SignOut />
        </>
      ) : (
        <>
          <p>You are not signed in</p>
          <Link href="./sign-in">
            <Button>Sign in</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Page;
