"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface ButtonLikeProps {
  postId: string;
  postLike: number;
  onLikeChange?: (liked: boolean) => void;
}

const ButtonLike = ({ postId, postLike }: ButtonLikeProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(postLike); // <-- ตั้งค่าเริ่มจาก props

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const res = await fetch(`/api/posts/like?postId=${postId}`);
        const data = await res.json();
        setIsLiked(data.liked);
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiked();
  }, [postId]);

  const handleLike = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/posts/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        const newLikeState = !isLiked;
        setIsLiked(newLikeState);
        setLikeCount((prev) => prev + (newLikeState ? 1 : -1)); // update count
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={`${
          isLiked
            ? "text-red-500 hover:text-red-600"
            : "text-gray-500 hover:text-gray-600"
        }`}
      >
        {isLiked ? (
          <Heart className="w-5 h-5 fill-current" />
        ) : (
          <Heart className="w-5 h-5" />
        )}
        <span className="ml-2">Like</span>
      </Button>
      <span className="text-sm text-gray-500">
        {likeCount} {likeCount === 1 ? "like" : "likes"}
      </span>
    </div>
  );
};

export default ButtonLike;