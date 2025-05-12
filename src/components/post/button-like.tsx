"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ButtonLikeProps {
  postId: string
  postLike: number
  isLiked?: boolean
  onLikeChange?: (liked: boolean) => void
}

const ButtonLike = ({ postId, postLike, isLiked = false, onLikeChange }: ButtonLikeProps) => {
  const route = useRouter()
  const [liked, setLiked] = useState(isLiked)
  const [isLoading, setIsLoading] = useState(false)
  const [likeCount, setLikeCount] = useState(postLike)

  const handleLike = async () => {
    const newLikeState = !liked
    setLiked(newLikeState)
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
        setLikeCount((prev) => prev + (newLikeState ? 1 : -1))
        if (onLikeChange) {
          onLikeChange(newLikeState)
        }
      }

      if (!response.ok) {
        setLiked(!newLikeState)
        toast.error("Please sign in to like posts")
        route.push("/sign-in")
      }
    } catch (error) {
      console.error("Error liking post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={`group transition-colors ${
          liked 
            ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" 
            : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        }`}
      >
        <Heart className={`w-5 h-5 transition-all ${
          liked 
            ? "fill-current scale-110" 
            : "group-hover:scale-110 group-hover:fill-current"
        }`} />
        <span className="ml-2 font-medium">Like</span>
      </Button>
      <span className="text-sm text-muted-foreground font-medium">
        {likeCount} {likeCount === 1 ? "like" : "likes"}
      </span>
    </div>
  )
}

export default ButtonLike