// src/pages/dashboard/blog/NewBlogPostPage.tsx
import React from "react";
import BlogPostForm from "@/components/dashboard/blog/BlogPostForm";

const NewBlogPostPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <BlogPostForm />
    </div>
  );
};

export default NewBlogPostPage;
