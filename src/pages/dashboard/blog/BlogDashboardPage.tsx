import React from "react";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { BlogPost } from "@/interfaces";
import { useNavigate } from "react-router-dom";

const BlogDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = (post: BlogPost) => {
    navigate(`/dashboard/blog/edit/${post.id}`); // Redirige a la página de edición
  };

  return (
    <div className="container mx-auto">
      <BlogPostList onEdit={handleEdit} />
    </div>
  );
};

export default BlogDashboardPage;