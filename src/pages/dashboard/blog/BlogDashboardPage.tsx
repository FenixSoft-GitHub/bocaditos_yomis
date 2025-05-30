// src/pages/dashboard/blog/BlogDashboardPage.tsx
import React from "react";
import BlogPostList from "@/components/blog/BlogPostList";
import { BlogPost } from "@/interfaces";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación

const BlogDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = (post: BlogPost) => {
    navigate(`/dashboard/blog/edit/${post.id}`); // Redirige a la página de edición
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Administración del Blog</h1>
      <BlogPostList onEdit={handleEdit} />
    </div>
  );
};

export default BlogDashboardPage;
