"use client";

import ContentPost from "@/components/post/content-post";
import CreatePost from "@/components/post/create-post";
import { useState } from "react";

const Page = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1);  // เพิ่ม refreshKey เพื่อรีเฟรช
  };

  return (
    <div className="space-y-5 min-h-screen py-12 px-4">
      <CreatePost onPostCreated={handlePostCreated} />
      <ContentPost refreshKey={refreshKey} />
    </div>
  );
};

export default Page;