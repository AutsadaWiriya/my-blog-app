"use client";

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
import PaginationInput from "@/components/manage/users/PaginationInput";
import LimitInput from "@/components/manage/users/LimitInput";
import SearchUser from "@/components/manage/users/SearchUser";
import DeleteUser from "@/components/manage/users/DeleteUser";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Page {
  currentPage: number;
  limit: number;
  search: string;
  currentId: string;
}

const UsersTable = ({ currentPage, limit, search, currentId }: Page) => {
  const [users, setUsers] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `/api/manageuser?page=${currentPage}&limit=${limit}&search=${search}`
        );
        const data = await res.json();
        console.log(data);
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentPage, limit, search]);

  return (
    <>
      <div className="space-y-5">
        <div className="flex justify-between">
          <LimitInput currentLimit={limit} />
          <SearchUser currentPage={currentPage} limit={limit} search={search} />
        </div>
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name}
                  {currentId === user.id && (
                    <span className="text-red-500"> (me)</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Select value={user.role} disabled={user.id === currentId}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="w-32">
                      <SelectItem value="member">member</SelectItem>
                      <SelectItem value="manager">manager</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{user.email}</TableCell>

                <TableCell className="text-right">
                  {currentId === user.id ? (
                    <Button disabled className="w-21.5">
                      Delete
                    </Button>
                  ) : (
                    <DeleteUser userId={user.id} />
                  )}
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
                <PaginationPrevious
                  href={`?page=${
                    currentPage - 1
                  }&limit=${limit}&search=${search}`}
                />
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
                limit={limit}
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
                <PaginationNext
                  href={`?page=${
                    currentPage + 1
                  }&limit=${limit}&search=${search}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default UsersTable;
