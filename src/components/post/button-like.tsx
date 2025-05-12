"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ButtonLikeProps {
  postId: string
  postLike: number
  isLiked?: boolean
  onLikeChange?: (liked: boolean) => void
}

const ButtonLike = ({ postId, postLike, isLiked = false, onLikeChange }: ButtonLikeProps) => {
  const router = useRouter()
  const [liked, setLiked] = useState(isLiked)
  const [isLoading, setIsLoading] = useState(false)
  const [likeCount, setLikeCount] = useState(postLike)
  const [animating, setAnimating] = useState(false)

  const handleLike = async () => {
    const newLikeState = !liked
    setLiked(newLikeState)
    
    if (newLikeState) {
      setAnimating(true)
      setTimeout(() => setAnimating(false), 800)
    }
    
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
        toast.error("You must sign in to like a post")
        router.push("/sign-in")
      }
    } catch (error) {
      console.error("Error liking post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          "text-muted-foreground hover:text-foreground group gap-2",
          liked && "text-red-500 hover:text-red-600"
        )}
      >
        <span className={cn(
          "relative transition-all",
          animating && "animate-heartbeat"
        )}>
          <Heart 
            className={cn(
              "w-4 h-4 transition-all", 
              liked ? "fill-red-500 stroke-red-500" : "fill-none group-hover:scale-110 duration-300"
            )} 
          />
        </span>
        <span>{liked ? "Liked" : "Like"}</span>
      </Button>
      <span className={cn(
        "text-xs font-medium px-1.5 py-0.5 rounded-full transition-all",
        liked ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300" : "text-muted-foreground"
      )}>
        {likeCount > 0 && likeCount}
      </span>
    </div>
  )
}

export default ButtonLike