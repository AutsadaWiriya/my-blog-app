import { auth } from "@/lib/auth";
import ChatContainer from "@/components/chat/chat-container";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-8 px-4">
      <div className="w-full max-w-3xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
        
        <ChatContainer userId={session.user.id || ""} />
      </div>
    </div>
  );
} 