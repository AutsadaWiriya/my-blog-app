import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UsersTable from "@/components/manage/users/usersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  searchParams: { page?: string; limit?: string; search?: string };
}

const page = async ({ searchParams }: Props) => {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || !["manager", "admin"].includes(role ?? "")) redirect("/404");

  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);
  const search = params.search || ""; //

  return (
    <>
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable
              currentPage={currentPage}
              limit={limit}
              search={search}
              currentId={session?.user?.id as string}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default page;
