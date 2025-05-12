"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AlertCircle, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ButtonLike from "./button-like";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommentsSection from "./comments-section";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  likes: {
    id: string;
    userId: string;
  }[];
  expanded?: boolean;
  showComments?: boolean;
}

interface ContentPostProps {
  refreshKey: number;
  currentId: string;
}

const ContentPost = ({ refreshKey, currentId }: ContentPostProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const latestPostDateRef = useRef<string | null>(null);

  const fetchPosts = useCallback(async (cursor?: string, isRefresh = false) => {
    try {
      setIsLoading(true);
      const url = cursor ? `/api/posts?cursor=${cursor}` : "/api/posts";
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        if (isRefresh) {
          setPosts(data.posts);
        } else {
          setPosts((prev) => {
            const newPosts = data.posts.filter(
              (newPost: Post) =>
                !prev.some((existingPost) => existingPost.id === newPost.id)
            );
            return [...prev, ...newPosts];
          });
        }

        setNextCursor(data.nextCursor);
        setHasMore(Boolean(data.nextCursor));

        if (data.posts.length > 0 && (isRefresh || posts.length === 0)) {
          latestPostDateRef.current = data.posts[0].createdAt;
        }

        if (isRefresh) {
          setHasNewPosts(false);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(undefined, true);
  }, [refreshKey, fetchPosts]);

  // 👇 โหลดโพสต์ใหม่ทุกครั้งที่ refreshKey เปลี่ยน
  useEffect(() => {
    fetchPosts();
  }, [refreshKey]); // เปลี่ยนแค่เมื่อ refreshKey เปลี่ยน

  // 👇 Observer สำหรับ Infinite Scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor) {
          fetchPosts(nextCursor);
        }
      },
      { threshold: 1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [nextCursor, hasMore, fetchPosts]);

  const handleRefresh = () => {
    fetchPosts(undefined, true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return `${diffSec} sec ago`;
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHour < 24) return `${diffHour} hr ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleComments = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, showComments: !post.showComments }
          : post
      )
    );
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* แจ้งเตือนโพสต์ใหม่ */}
      {hasNewPosts && (
        <Alert className="bg-blue-50 border-blue-200 mb-4">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex justify-between items-center">
            <span className="text-blue-600">มีโพสต์ใหม่!</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-blue-200 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            >
              โหลดโพสต์ใหม่
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading && posts.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-pulse text-gray-500">กำลังโหลดโพสต์...</div>
        </div>
      )}

      {/* แสดงโพสต์ */}
      {posts.map((post, index) => (
        <Card key={`${post.id}-${index}`} className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <Avatar>
              <AvatarImage
                src={post.user.image || "/placeholder.svg"}
                alt={post.user.name}
              />
              <AvatarFallback>
                {post.user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.user.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save post</DropdownMenuItem>
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          
          <CardContent className="px-5 pb-4">
            <div className="relative">
              <p
                className={`whitespace-pre-wrap ${
                  !post.expanded && "line-clamp-10"
                }`}
              >
                {post.content}
              </p>
              {post.content.split("\n").length > 6 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                  onClick={() => {
                    setPosts((prev) =>
                      prev.map((p) =>
                        p.id === post.id ? { ...p, expanded: !p.expanded } : p
                      )
                    );
                  }}
                >
                  {post.expanded ? "Show less" : "Show more"}
                </Button>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="border-t flex-col">
            <div className="flex items-center gap-4 w-full">
              <ButtonLike
                postId={post.id}
                postLike={post.likes.length}
                isLiked={post.likes.some((like) => like.userId === currentId)}
              />
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground gap-2"
                onClick={() => toggleComments(post.id)}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Comment</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2 ml-auto">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>

            {post.showComments && (
              <div className="w-full mt-4 pt-2 border-t">
                <CommentsSection postId={post.id} currentUserId={currentId} />
              </div>
            )}
          </CardFooter>
        </Card>
      ))}

      {hasMore && !isLoading && (
        <div
          ref={observerRef}
          className="text-center py-4 text-sm text-gray-500"
        >
          กำลังโหลดเพิ่มเติม...
        </div>
      )}

      {isLoading && posts.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          กำลังโหลดเพิ่มเติม...
        </div>
      )}

      {!hasMore && !isLoading && (
        <div className="text-center py-4 text-sm text-gray-400">
          ไม่มีโพสต์เพิ่มเติมแล้ว
        </div>
      )}
    </div>
  );
};

export default ContentPost;