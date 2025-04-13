import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";

interface User {
  email?: string;
  name?: string;
  role?: string;
  image?: string;
}

const Page = async () => {
  const session = await auth();
  const user = session?.user as User;

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto p-4">
          {/* Header */}
          <div className="text-center pt-8">
            <h1 className="text-3xl font-bold dark:text-white">My Profile</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              View and manage your account information
            </p>
          </div>

          {/* Profile */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden mt-8 border border-gray-200 dark:border-gray-700">
            <div className="relative h-40 bg-gradient-to-r from-violet-600 to-indigo-700 dark:from-violet-800 dark:to-indigo-900">
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 rounded-full shadow-lg">
                  <AvatarImage
                    src={user.image || "/placeholder.svg"}
                    alt={user.name || "Profile"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 dark:from-violet-700 dark:to-indigo-800 text-white">
                    {user.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="mt-20 text-center pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Role: {user.role || "member"}
              </p>

              <div className="mt-6 px-6">
                <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-indigo-600 dark:from-violet-700 dark:to-indigo-800 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
