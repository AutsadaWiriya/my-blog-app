import { auth } from "@/lib/auth";
import { AppSidebar } from "./app-sidebar";

export async function AppSidebarWrapper() {
  const session = await auth();
  return <AppSidebar session={session} />;
}