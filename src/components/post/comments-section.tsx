"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SendHorizontal } from "lucide-react";
import { toast } from "sonner";
import CommentItem from "./comment-item";

interface CommentsSectionProps {
  postId: string;
  currentUserId: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  postId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default function CommentsSection({
  postId,
  currentUserId,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      if (response.ok) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async () => {
    if (comment.trim() === "") return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/comments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setComment("");
        fetchComments();
        toast.success("Comment posted successfully");
      } else {
        toast.error(data.message || "Failed to post comment");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 mt-2">
      {currentUserId && (
        <div className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px] resize-none focus-visible:ring-primary/50"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || comment.trim() === ""}
              className="px-4 gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white relative overflow-hidden transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="font-medium">Posting...</span>
                </>
              ) : (
                <>
                  <SendHorizontal className="h-4 w-4" />
                  <span className="font-medium">Post</span>
                </>
              )}
              <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary/70" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm font-medium text-muted-foreground">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </div>
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onCommentUpdated={fetchComments}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No comments yet</p>
          <p className="text-sm">Be the first to comment</p>
        </div>
      )}
    </div>
  );
} 