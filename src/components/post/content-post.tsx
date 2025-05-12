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
  expanded?: boolean;
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

  useEffect(() => {
    fetchPosts();
  }, [refreshKey]);

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

  const handleRefresh = () => {
    fetchPosts(undefined, true);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {hasNewPosts && (
        <Alert className="bg-blue-50/30 backdrop-blur-sm border-blue-200 mb-4 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex justify-between items-center">
            <span className="text-blue-600 font-medium">New posts available!</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-blue-200 text-blue-600 hover:bg-blue-100/50 hover:text-blue-700"
            >
              Load new posts
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading && posts.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading posts...</div>
        </div>
      )}

      {posts.map((post, index) => (
        <Card key={`${post.id}-${index}`} className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/10">
              <AvatarImage
                src={post.user.image || "/placeholder.svg"}
                alt={post.user.name}
              />
              <AvatarFallback className="bg-primary/5 text-primary font-medium">
                {post.user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{post.user.name}</p>
              <p className="text-sm text-muted-foreground">
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
            <div className="relative">
              <p
                className={`whitespace-pre-wrap text-foreground/90 ${
                  !post.expanded && "line-clamp-10"
                }`}
              >
                {post.content}
              </p>
              {post.content.split("\n").length > 10 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-primary hover:text-primary/90 p-0 h-auto font-normal"
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
          <CardFooter>
            <ButtonLike
              postId={post.id}
              postLike={post.likes.length}
              isLiked={post.likes.some((like) => like.userId === currentId)}
            />
          </CardFooter>
        </Card>
      ))}

      {hasMore && !isLoading && (
        <div
          ref={observerRef}
          className="text-center py-6 text-sm text-muted-foreground animate-pulse"
        >
          Loading more posts...
        </div>
      )}

      {isLoading && posts.length > 0 && (
        <div className="text-center py-6 text-sm text-muted-foreground animate-pulse">
          Loading more posts...
        </div>
      )}

      {!hasMore && !isLoading && posts.length > 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          You've reached the end
        </div>
      )}
    </div>
  );
};

export default ContentPost;