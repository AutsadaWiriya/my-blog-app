"use client"

import { useState, useEffect } from "react"
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
  const [hearts, setHearts] = useState<{ id: number; left: number; animationDuration: number }[]>([])

  useEffect(() => {
    setLiked(isLiked)
  }, [isLiked])

  const createHeartAnimation = () => {
    if (hearts.length >= 5) return // Limit max concurrent animations
    
    const newHearts = [...hearts]
    const id = Date.now()
    const left = Math.random() * 30
    const animationDuration = 700 + Math.random() * 500
    
    newHearts.push({ id, left, animationDuration })
    setHearts(newHearts)
    
    setTimeout(() => {
      setHearts(prev => prev.filter(heart => heart.id !== id))
    }, animationDuration)
  }

  const handleLike = async () => {
    const newLikeState = !liked
    setLiked(newLikeState)
    
    if (newLikeState) {
      setAnimating(true)
      createHeartAnimation()
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

        // Notify parent component about the like change
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
    <div className="relative flex items-center gap-3">
      {/* Floating hearts animation */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-full pointer-events-none"
          style={{
            left: `${heart.left}px`,
            animation: `float-up ${heart.animationDuration}ms ease-out forwards`,
          }}
        >
          <Heart 
            className="w-4 h-4 fill-red-500 text-red-500 opacity-80" 
            style={{ 
              animation: `pulse-fade ${heart.animationDuration}ms ease-out forwards` 
            }}
          />
        </div>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          "relative overflow-hidden rounded-full transition-all duration-300 flex items-center gap-2 px-4 h-9 hover:bg-gray-100 dark:hover:bg-gray-800",
          liked ? "text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300" : 
                 "text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        )}
      >
        <span className={cn(
          "relative transition-transform",
          (animating || isLoading) && "animate-heartbeat"
        )}>
          {liked ? 
            <Heart className="w-5 h-5 fill-current" /> : 
            <Heart className="w-5 h-5" />
          }
        </span>
        <span className={cn(
          "text-sm font-medium",
          liked ? "text-red-500 dark:text-red-400" : "text-gray-600 dark:text-gray-400"
        )}>
          Like
        </span>
        {liked && (
          <span 
            className="absolute inset-0 rounded-full opacity-20 bg-red-100 dark:bg-red-900"
          />
        )}
      </Button>
      <span className={cn(
        "text-sm font-medium transition-all", 
        liked ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
      )}>
        {likeCount} {likeCount === 1 ? "like" : "likes"}
      </span>

      <style jsx global>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0.7;
          }
          50% {
            opacity: 0.9;
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            transform: translateY(-40px) scale(0.8);
            opacity: 0;
          }
        }
        
        @keyframes pulse-fade {
          0% { transform: scale(1); }
          40% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
          45% { transform: scale(1.2); }
          60% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default ButtonLike