"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

interface MessageItemProps {
  message: {
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  currentUserId: string;
}

export default function MessageItem({ message, currentUserId }: MessageItemProps) {
  const isCurrentUser = message.user.id === currentUserId;

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: th,
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className={`flex items-start gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8 mt-1">
        {message.user.image ? (
          <AvatarImage src={message.user.image} alt={message.user.name || "User"} />
        ) : (
          <AvatarFallback className="text-xs">
            {message.user.name?.slice(0, 2).toUpperCase() || "UN"}
          </AvatarFallback>
        )}
      </Avatar>
      <div className={`${isCurrentUser ? "items-end" : "items-start"} flex flex-col max-w-[75%]`}>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{message.user.name || "Anonymous"}</span>
          <span className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</span>
        </div>
        <div
          className={`px-3 py-2 rounded-lg mt-1 ${
            isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    </div>
  );
} 