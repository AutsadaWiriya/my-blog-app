"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface ButtonLikeProps {
  postId: string
  postLike: number
  isLiked?: boolean
  onLikeChange?: (liked: boolean) => void
}

const ButtonLike = ({ postId, postLike, isLiked = false, onLikeChange }: ButtonLikeProps) => {
  const [liked, setLiked] = useState(isLiked)
  const [isLoading, setIsLoading] = useState(false)
  const [likeCount, setLikeCount] = useState(postLike)

  const handleLike = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/posts/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      })

      if (response.ok) {
        const newLikeState = !liked
        setLiked(newLikeState)
        setLikeCount((prev) => prev + (newLikeState ? 1 : -1))

        // Notify parent component about the like change
        if (onLikeChange) {
          onLikeChange(newLikeState)
        }
      }
    } catch (error) {
      console.error("Error liking post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={`${liked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600"}`}
      >
        {liked ? <Heart className="w-5 h-5 fill-current" /> : <Heart className="w-5 h-5" />}
        <span className="ml-2">Like</span>
      </Button>
      <span className="text-sm text-gray-500">
        {likeCount} {likeCount === 1 ? "like" : "likes"}
      </span>
    </div>
  )
}

export default ButtonLike