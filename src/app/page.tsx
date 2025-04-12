import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";

interface User {
  email?: string;
  name?: string;
  role?: string;
}

const Page = async () => {
  const session = await auth();
  const user = session?.user as User;

  return (
    <div className="flex items-center justify-center min-h-1/2">
      {session ? (
        <>
          <Card className="min-w-96 ">
            <CardContent>
              <div className="space-y-4 text-center">
                <h1 className="text-4xl font-black">Wellcome</h1>
                <div>Email: {user.email}</div>
                <div>Name: {user.name}</div>
                <div>Role: {user.role}</div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default Page;
