// src/pages/dashboard/blog/EditBlogPostPage.tsx
import React from "react";
import { useParams } from "react-router-dom"; // Para obtener parámetros de la URL
import BlogPostForm from "@/components/dashboard/blog/BlogPostForm";
import { useBlogPost } from "@/hooks";

const EditBlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtiene el 'id' de la URL
  const { blogPost, isLoadingBlogPost, blogPostError } = useBlogPost(
    id as string
  );

  if (isLoadingBlogPost) {
    return <p>Cargando publicación para editar...</p>;
  }

  if (blogPostError) {
    return <p>Error al cargar la publicación: {blogPostError.message}</p>;
  }

  if (!blogPost) {
    return <p>Publicación no encontrada.</p>;
  }

  return (
    <div className="container mx-auto">
      <BlogPostForm initialData={blogPost} isEditing={true} />
    </div>
  );
};

export default EditBlogPostPage;
