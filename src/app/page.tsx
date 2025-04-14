import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";

interface User {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  image?: string;
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
                <div>ID: {user.id}</div>
                <div>Email: {user.email}</div>
                <div>Name: {user.name}</div>
                <div>Role: {user.role}</div>
                <div>Role: {user.image}</div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default Page;
