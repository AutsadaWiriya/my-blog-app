import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import InfoProfile from "@/components/profile/infoProfile"
import DangerZone from "@/components/profile/dangerZone"

interface User {
  email?: string
  name?: string
  role?: string
  image?: string
  createdAt?: string
}

const Page = async () => {
  const session = await auth()
  if (!session) redirect("/")

  const user = session?.user as User

  // Format the date if available
  let formattedDate = ""
  if (user.createdAt) {
    const date = new Date(user.createdAt)
    formattedDate = date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">My Profile</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage your account information
          </p>
        </div>

        <InfoProfile 
          name={user.name ?? ''}
          email={user.email ?? ''}
          role={user.role ?? ''}
          image={user.image ?? ''}
          createdAt={formattedDate}
        />
        <DangerZone email={user.email ?? ''}/>
      </div>
    </div>
  )
}

export default Page