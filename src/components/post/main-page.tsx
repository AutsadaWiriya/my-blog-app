"use client";

import ContentPost from "@/components/post/content-post";
import CreatePost from "@/components/post/create-post";
import { useState } from "react";

const MainPage = ({ currentId }: { currentId: string }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1); // เพิ่ม refreshKey เพื่อรีเฟรช
  };

  return (
    <div className="space-y-5 min-h-screen py-12 px-4">
      {currentId && <CreatePost onPostCreated={handlePostCreated} />}
      <ContentPost refreshKey={refreshKey} currentId={currentId} />
    </div>
  );
};

export default MainPage;
