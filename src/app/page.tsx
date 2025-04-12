import { SignOut } from "@/components/sign-out";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";

const Page = async () => {
  const session = await auth();

  return (
    <div className="">
      <p>You are not signed in</p>
      {session ? (
        <>
          {session.user?.email}
          {session.user?.name}
          <SignOut />
        </>
      ) : (
        <>
          <Link href="./sign-in">
            <Button>Sign in</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Page;
