import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import UsersTable from "@/components/manage/users/usersTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  searchParams: { page?: string; limit?: string; search?: string }
}

export default async function UsersPage({ searchParams }: Props) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!session || !["manager", "admin"].includes(role ?? "")) redirect("/404")

  const currentPage = Number.parseInt(searchParams.page || "1", 10)
  const limit = Number.parseInt(searchParams.limit || "10", 10)
  const search = searchParams.search || ""
  const userId = session.user?.id as string

  return (
    <>
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable currentPage={currentPage} limit={limit} search={search} currentId={userId} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}