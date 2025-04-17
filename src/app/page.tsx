"use client";

import ContentPost from "@/components/post/content-post";
import CreatePost from "@/components/post/create-post";
import { useState } from "react";

const Page = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <div className="space-y-5 min-h-screen py-12 px-4">
        <CreatePost onPostCreated={handlePostCreated} />
        <ContentPost key={refreshKey} />
      </div>
    </>
  );
};

export default Page;
