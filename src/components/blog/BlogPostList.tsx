// src/components/blog/BlogPostList.tsx
import React from "react";
import { useBlogPosts } from "@/hooks";
import { Link } from "react-router-dom";
import { BlogPost } from "@/interfaces";

import { useState } from "react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { IoIosCreate } from "react-icons/io";
import { MdDeleteForever, MdEditDocument } from "react-icons/md";


interface BlogPostListProps {
  onEdit: (post: BlogPost) => void;
}

const BlogPostList: React.FC<BlogPostListProps> = ({ onEdit }) => {
  const {
    blogPosts,
    isLoadingBlogPosts,
    blogPostsError,
    deletePost,
    isDeletingPost,
  } = useBlogPosts();

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestDelete = (id: string) => {
    setSelectedPostId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPostId) {
      deletePost(selectedPostId);
      setIsModalOpen(false);
      setSelectedPostId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedPostId(null);
  };


  // const handleDelete = (id: string) => {
  //   if (
  //     window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")
  //   ) {
  //     deletePost(id);
  //   }
  // };

  if (isLoadingBlogPosts) {
    return <p>Cargando publicaciones...</p>;
  }

  if (blogPostsError) {
    return <p>Error al cargar las publicaciones: {blogPostsError.message}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mis Publicaciones</h2>
      <Link
        to="/dashboard/blog/new"
        className="bg-amber-500 text-cream px-4 py-2 rounded hover:bg-amber-600 mb-4 flex gap-2 w-fit"
      >
        <IoIosCreate className="size-6" />
        Nueva Publicación
      </Link>

      {blogPosts && blogPosts.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        <ul className="space-y-4">
          {blogPosts?.map((post) => (
            <li
              key={post.id}
              className="border border-cream/30 p-4 rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-cream/50">Slug: {post.slug}</p>
                <p className="text-sm text-cream/80">Estado: {post.status}</p>
                {post.published_at && (
                  <p className="text-sm text-cream/80">
                    Publicado:{" "}
                    {new Date(post.published_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(post)}
                  className="px-3 py-1 rounded bg-amber-500 text-cream hover:bg-amber-600 flex gap-2 w-fit"
                >
                  <MdEditDocument className="size-5" />
                  Editar
                </button>
                <button
                  onClick={() => handleRequestDelete(post.id!)}
                  disabled={isDeletingPost}
                  // className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                  className="px-3 py-1 rounded bg-red-500 text-cream hover:bg-red-600 flex gap-2 w-fit disabled:opacity-50"
                >
                  <MdDeleteForever className="size-5" />
                  {isDeletingPost ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar publicación"
        message="¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isConfirming={isDeletingPost}
      />
    </div>
  );
};

export default BlogPostList;
