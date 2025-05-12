"use client";

import ContentPost from "@/components/post/content-post";
import CreatePost from "@/components/post/create-post";
import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const MainPage = ({ currentId }: { currentId: string }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="hidden md:block md:col-span-3">
          <div className="bg-card rounded-xl shadow-sm border p-5 sticky top-20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary/10 rounded-full p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-semibold text-lg">Welcome</h2>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share your thoughts and connect with others in our community.
              </p>
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 group"
              >
                <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                <span>Refresh Feed</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-9 space-y-6">
          {/* Mobile Refresh Button */}
          <div className="flex md:hidden justify-end mb-2">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Create Post */}
          {currentId && (
            <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
              <CreatePost onPostCreated={handlePostCreated} />
            </div>
          )}

          {/* Content Posts */}
          <ContentPost refreshKey={refreshKey} currentId={currentId} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
