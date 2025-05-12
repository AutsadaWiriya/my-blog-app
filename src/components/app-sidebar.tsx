"use client";
import { ChevronUp, Moon, Sun } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { menuItems } from "./nav-links";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";

interface AppSidebarProps {
  session: Session | null;
}

export function AppSidebar({ session }: AppSidebarProps) {
  return (
    <Sidebar className="border-r shadow-sm">
      <SidebarHeader className="px-3 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
            <span className="font-semibold">B</span>
          </div>
          <h1 className="font-bold text-xl">BlogApp</h1>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.title}</span>
                      {item.title === "Home" && (
                        <SidebarMenuBadge className="ml-auto bg-primary/10 text-primary text-xs rounded-full px-2">
                          New
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            {session ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="hover:bg-accent hover:text-accent-foreground rounded-md transition-all duration-200">
                      <Avatar className="h-6 w-6 mr-2">
                        {session?.user?.image && (
                          <AvatarImage src={session?.user?.image} />
                        )}
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {session.user?.name?.slice(0, 2).toUpperCase() || "GU"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[140px]">
                        {session?.user?.name || "Guest"}
                      </span>
                      <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="end"
                    className="w-64 md:w-56"
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        {session?.user?.image && (
                          <AvatarImage src={session?.user?.image} />
                        )}
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {session.user?.name?.slice(0, 2).toUpperCase() || "GU"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium">
                          {session?.user?.name || "Guest"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {session?.user?.email || ""}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <SidebarMenuButton asChild>
                  <Link href="/sign-in">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </SidebarMenuButton>
              </>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
