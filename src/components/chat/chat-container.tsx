"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2, RefreshCw, Info, Users, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import MessageItem from "./message-item";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface ChatContainerProps {
  userId: string;
}

export default function ChatContainer({ userId }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRealtime, setIsRealtime] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const LIMIT = 20;
  const THRESHOLD = 50;

  const scrollToBottom = () => {
    if (shouldScrollToBottom) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchMessages = async (cursor?: string | null) => {
    try {
      if (loadingMore && cursor) return;
      
      if (!cursor) setIsLoading(true);
      else setLoadingMore(true);
      
      console.log("Fetching messages, cursor:", cursor);
      const url = `/api/chat?limit=${LIMIT}${cursor ? `&cursor=${cursor}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        console.log("Messages received:", data.messages?.length || 0, "hasMore:", data.hasMore);
        
        if (cursor) {
          const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
          if (scrollContainer) {
            scrollPositionRef.current = scrollContainer.scrollHeight;
          }
          
          setMessages(prev => [...data.messages, ...prev]);

          setTimeout(() => {
            const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
              const newPosition = scrollContainer.scrollHeight - scrollPositionRef.current;
              scrollContainer.scrollTop = newPosition > 0 ? newPosition : 0;
            }
          }, 50);
        } else {
          setMessages(data.messages || []);
        }
        
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreMessages = useCallback(async () => {
    if (!nextCursor || loadingMore || isLoading || !hasMore) {
      console.log("Skip loading more:", { 
        nextCursor: !!nextCursor, 
        loadingMore, 
        isLoading, 
        hasMore 
      });
      return;
    }

    console.log("Loading more messages...");
    setLoadingMore(true);
    setShouldScrollToBottom(false);
    await fetchMessages(nextCursor);
  }, [nextCursor, loadingMore, isLoading, hasMore]);

  const refreshMessages = async () => {
    try {
      setIsRefreshing(true);
      await fetchMessages();
      toast.success("Messages refreshed");
    } catch (error) {
      console.error("Error refreshing messages:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const setupPusher = () => {
    if (!pusherClient) {
      console.warn("Pusher client not available. Real-time updates disabled.");
      setIsRealtime(false);
      return null;
    }

    try {
      console.log("Setting up Pusher connection...");
      const client = pusherClient;
      const channel = client.subscribe("chat");
      
      const handleNewMessage = (newMessage: Message) => {
        console.log("New message received:", newMessage);
        setMessages((prev) => {
          if (prev.some(msg => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
      };

      channel.bind("new-message", handleNewMessage);
      setIsRealtime(true);

      return () => {
        console.log("Cleaning up Pusher connection...");
        try {
          channel.unbind("new-message", handleNewMessage);
          client.unsubscribe("chat");
        } catch (error) {
          console.error("Error unsubscribing from Pusher:", error);
        }
      };
    } catch (error) {
      console.error("Error setting up Pusher:", error);
      setIsRealtime(false);
      return null;
    }
  };

  useEffect(() => {
    fetchMessages();

    const cleanup = setupPusher();
    
    let intervalId: NodeJS.Timeout | undefined;
    if (!isRealtime) {
      intervalId = setInterval(() => {
        setShouldScrollToBottom(true);
        fetchMessages();
      }, 10000);
    }

    return () => {
      if (cleanup) cleanup();
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, shouldScrollToBottom]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      setIsSending(true);
      console.log("Sending message:", message);
      
      setShouldScrollToBottom(true);
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to send message");
      }

      console.log("Message sent successfully:", responseData);

      if (!isRealtime) {
        await fetchMessages();
      }
      
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error((error as Error).message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    
    if (scrollTop < THRESHOLD && hasMore && !loadingMore && !isLoading) {
      console.log('Scroll position near top, auto loading more...', scrollTop);
      loadMoreMessages();
    }
  }, [hasMore, loadingMore, isLoading, loadMoreMessages]);

  const handleRefresh = async () => {
    setShouldScrollToBottom(true);
    await refreshMessages();
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="p-4 pb-3 space-y-1">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Community Chat</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant={isRealtime ? "default" : "outline"} className="h-5 gap-1 ml-1">
                    {isRealtime ? (
                      <span className="inline-flex gap-1 items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                        Live
                      </span>
                    ) : (
                      "Polling"
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isRealtime 
                    ? "Messages appear in real-time" 
                    : "Refreshing every 10 seconds"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleRefresh} 
                  disabled={isRefreshing}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="sr-only">Refresh messages</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                Refresh messages
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Chat with everyone in the community
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 relative">
        <ScrollArea 
          className="h-[500px] px-4 pb-4" 
          onScroll={handleScroll} 
          ref={scrollAreaRef}
        >
          {isLoading && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">No messages yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Be the first to start the conversation
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {loadingMore && (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary/70" />
                </div>
              )}
              {hasMore && !loadingMore && nextCursor && (
                <div className="flex justify-center py-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={loadMoreMessages}
                    className="text-xs text-muted-foreground flex items-center gap-1"
                  >
                    <ChevronUp className="h-3 w-3" />
                    Load more
                  </Button>
                </div>
              )}
              {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} currentUserId={userId} />
              ))}
              <div ref={messageEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 border-t bg-card">
        <div className="w-full space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="min-h-[60px] resize-none focus-visible:ring-primary/50"
              disabled={isSending}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={handleSendMessage} 
                    size="icon"
                    className="shrink-0"
                    disabled={isSending || !message.trim()}
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SendHorizontal className="h-4 w-4" />
                    )}
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="end">
                  Send message (press Enter)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardFooter>
    </Card>
  );
} 