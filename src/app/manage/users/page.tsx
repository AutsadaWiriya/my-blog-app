import { cookies } from "next/headers";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PaginationInput from "@/components/pagination/PaginationInput";
import LimitInput from "@/components/pagination/LimitInput";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface User {
  id: string;
  name: string;
  createdAt: string;
  role: string;
  email: string;
}

interface Props {
  searchParams: { page?: string; limit?: string };
}

const page = async ({ searchParams }: Props) => {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || !["manager", "admin"].includes(role ?? "")) redirect("/404");

  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "10", 10);

  const cookieStore = await cookies();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/manageuser?page=${currentPage}&limit=${limit}`,
    {
      headers: {
        cookie: cookieStore
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join("; "),
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return <div className="p-4 text-red-500">Error: {data.error}</div>;
  }

  const users = data.users;
  const totalPages = data.totalPages;

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 space-y-5">
        <LimitInput currentLimit={limit} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Option</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.name}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right">
                  <Button>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`?page=${currentPage - 1}`} />
              </PaginationItem>
            )}

            {currentPage <= 1 && (
              <PaginationItem>
                <PaginationPrevious />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationInput
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="ml-2">{`/ ${totalPages}`}</span>
            </PaginationItem>

            {currentPage >= totalPages && (
              <PaginationItem>
                <PaginationNext />
              </PaginationItem>
            )}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={`?page=${currentPage + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default page;
