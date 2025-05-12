import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import UsersTable from "@/components/manage/users/usersTable"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UsersRound, ShieldCheck } from "lucide-react"

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
    <div className="container mx-auto py-8 px-4 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-lg">
            <UsersRound className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage your application users and their roles</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
          <ShieldCheck className="h-4 w-4" />
          <span>{role === "admin" ? "Admin Access" : "Manager Access"}</span>
        </div>
      </div>
      
      <Card className="shadow-sm border rounded-xl overflow-hidden">
        <CardHeader className="bg-card border-b">
          <CardTitle>Users</CardTitle>
          <CardDescription>
            View and manage all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <UsersTable currentPage={currentPage} limit={limit} search={search} currentId={userId} />
        </CardContent>
      </Card>
    </div>
  )
}