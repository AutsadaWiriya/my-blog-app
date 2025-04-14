import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import InfoProfile from "@/components/profile/infoProfile";

interface User {
  email?: string;
  name?: string;
  role?: string;
  image?: string;
}

const Page = async () => {
  const session = await auth();
  if (!session) redirect("/");
  const user = session?.user as User;

  return (
    <>
      <div className="max-w-3xl mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="text-center pt-8">
          <h1 className="text-3xl font-bold dark:text-white">My Profile</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage your account information
          </p>
        </div>

        {/* Profile */}
        <Card className="overflow-hidden py-0">
          <div className="relative h-40 bg-gradient-to-r from-violet-600 to-indigo-700 dark:from-violet-800 dark:to-indigo-900">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <Avatar className="w-32 h-32 shadow-lg">
                <AvatarImage
                  src={user.image || "/placeholder.svg"}
                  alt={user.name || "Profile"}
                />
                <AvatarFallback className="text-5xl">
                  {user.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <InfoProfile
            name={user.name || "Unknown"}
            email={user.email || "N/A"}
            role={user.role || "member"}
            image={user.image || "/placeholder.svg"}
          />
        </Card>
      </div>
    </>
  );
};

export default Page;
