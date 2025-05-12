"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import SelectRole from "@/components/manage/users/SelectRole";
import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Filter,
  RefreshCw,
  MoreHorizontal,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Page {
  currentPage: number;
  limit: number;
  search: string;
  currentId: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

const UsersTable = ({ currentPage, limit, search, currentId }: Page) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/manageuser?page=${currentPage}&limit=${limit}&search=${search}`
      );
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, limit, search]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, limit, search, fetchUsers]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <LimitInput currentLimit={limit} />
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-10 w-10"
          >
            <RefreshCw
              className={cn("h-4 w-4", refreshing && "animate-spin")}
            />
            <span className="sr-only">Refresh</span>
          </Button>
          <div className="hidden md:flex items-center text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded-md">
              {users.length > 0 ? `${users.length} users` : "No users"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>All Users</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Admin</DropdownMenuItem>
              <DropdownMenuItem>Manager</DropdownMenuItem>
              <DropdownMenuItem>Member</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SearchUser currentPage={currentPage} limit={limit} search={search} />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Joined</span>
                </div>
              </TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} className="group hover:bg-muted/50">
                  <TableCell>
                    <Avatar className="h-10 w-10 border">
                      {user.image && (
                        <AvatarImage src={user.image} alt={user.name || ""} />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name?.slice(0, 2).toUpperCase() || "UN"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium flex items-center gap-2">
                      {user.name || "Anonymous"}
                      {currentId === user.id && (
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground md:hidden mt-1">
                      {formatDate(user.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="md:hidden text-xs text-muted-foreground mb-2">
                      {user.email}
                    </div>
                    <SelectRole
                      userId={user.id}
                      userRole={user.role}
                      currentId={currentId}
                      onUpdateRole={fetchUsers}
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <DeleteUser
                        userId={user.id}
                        currentId={currentId}
                        onDelete={fetchUsers}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UsersRound className="h-8 w-8 mb-2 opacity-20" />
                    <p>No users found</p>
                    <p className="text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <p className="text-nowrap">
            Page {currentPage} of {totalPages}
          </p>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  currentPage > 1
                    ? `?page=${currentPage - 1}&limit=${limit}&search=${search}`
                    : ""
                }
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationInput
                currentPage={currentPage}
                totalPages={totalPages}
                limit={limit}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="text-sm text-muted-foreground">{` / ${totalPages}`}</span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href={
                  currentPage < totalPages
                    ? `?page=${currentPage + 1}&limit=${limit}&search=${search}`
                    : ""
                }
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default UsersTable;
