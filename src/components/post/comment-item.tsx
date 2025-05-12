"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Edit2, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  currentUserId: string;
  onCommentUpdated: () => void;
}

export default function CommentItem({
  comment,
  currentUserId,
  onCommentUpdated,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuthor = currentUserId === comment.userId;

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

  const handleEdit = async () => {
    if (editedContent.trim() === "") {
      toast.error("Comment cannot be empty");
      return;
    }

    if (editedContent === comment.content) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.ok) {
        toast.success("Comment updated successfully");
        setIsEditing(false);
        onCommentUpdated();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update comment");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Comment deleted successfully");
        onCommentUpdated();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete comment");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex space-x-3 group">
      <Avatar className="h-8 w-8">
        {comment.user.image && (
          <AvatarImage src={comment.user.image} alt={comment.user.name || ""} />
        )}
        <AvatarFallback className="text-xs">
          {comment.user.name?.slice(0, 2).toUpperCase() || "UN"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="bg-muted p-3 rounded-lg relative">
          <div className="flex items-center justify-between">
            <div className="font-medium text-sm">
              {comment.user.name || "Anonymous"}
            </div>
            {isAuthor && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100"
                    disabled={isDeleting}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[80px] text-sm"
                disabled={isSubmitting}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(comment.content);
                  }}
                  disabled={isSubmitting}
                >
                  <X className="mr-2 h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={isSubmitting || editedContent.trim() === ""}
                >
                  <Check className="mr-2 h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>
        <div className="text-xs text-muted-foreground px-3">
          {formatDate(comment.createdAt)}
        </div>
      </div>
    </div>
  );
} 