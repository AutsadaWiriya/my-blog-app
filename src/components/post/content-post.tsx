"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ButtonLike from "./button-like";

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
}

interface ContentPostProps {
  refreshKey: number; // รับค่า refreshKey จาก parent
}

const ContentPost = ({ refreshKey }: ContentPostProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const latestPostDateRef = useRef<string | null>(null);

  // 👇 โหลดโพสต์
  // Add fetchPosts to useCallback to prevent infinite loops
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
          // Prevent duplicate posts by checking IDs
          setPosts((prev) => {
            const newPosts = data.posts.filter(
              (newPost: Post) => !prev.some((existingPost) => existingPost.id === newPost.id)
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

  // Update dependency array
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
  }, [nextCursor, hasMore]);

  // 👇 รีโหลดโพสต์ใหม่
  const handleRefresh = () => {
    fetchPosts(undefined, true);
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

      {/* แสดงสถานะกำลังโหลด */}
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
              <AvatarImage src={post.user.image || "/placeholder.svg"} alt={post.user.name} />
              <AvatarFallback>{post.user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
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
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{post.content}</p>
          </CardContent>
          <CardFooter>
            <ButtonLike postId={post.id} postLike={post.likes.length} />
          </CardFooter>
        </Card>
      ))}

      {/* จุดสังเกตว่าถึงล่างสุดหรือยัง */}
      {hasMore && !isLoading && (
        <div ref={observerRef} className="text-center py-4 text-sm text-gray-500">
          กำลังโหลดเพิ่มเติม...
        </div>
      )}

      {/* แสดงสถานะกำลังโหลดเพิ่มเติม */}
      {isLoading && posts.length > 0 && <div className="text-center py-4 text-sm text-gray-500">กำลังโหลดเพิ่มเติม...</div>}

      {!hasMore && !isLoading && <div className="text-center py-4 text-sm text-gray-400">ไม่มีโพสต์เพิ่มเติมแล้ว</div>}
    </div>
  );
};

export default ContentPost;