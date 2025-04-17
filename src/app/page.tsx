"use client";

import ContentPost from "@/components/post/content-post";
import CreatePost from "@/components/post/create-post";

const Page = () => {
  return (
    <>
      <div className="space-y-5 pb-10">
        <CreatePost />
        <ContentPost />
      </div>
    </>
  );
};

export default Page;
