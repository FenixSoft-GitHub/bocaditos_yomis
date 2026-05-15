import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogPosts } from "@/hooks";
import { BlogPost } from "@/interfaces";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";
import { Pagination } from "@/components/shared/Pagination";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { DashboardAddButton } from "@/components/dashboard/shared/DashboardAddButton";
import {
  Pencil,
  Trash2,
  BookOpen,
  Calendar,
  Eye,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 9;

const statusConfig: Record<string, { label: string; className: string }> = {
  published: {
    label: "Publicado",
    className:
      "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  },
  draft: {
    label: "Borrador",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  archived: {
    label: "Archivado",
    className:
      "bg-gray-100   text-gray-600   dark:bg-gray-800/50   dark:text-gray-400",
  },
};

interface Props {
  onEdit: (post: BlogPost) => void;
}

export const BlogPostList: React.FC<Props> = ({ onEdit }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    blogPosts,
    isLoadingBlogPosts,
    blogPostsError,
    deletePost,
    isDeletingPost,
  } = useBlogPosts();

  const filtered = useMemo(
    () =>
      (blogPosts ?? []).filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.status?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [blogPosts, searchTerm],
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  if (isLoadingBlogPosts)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full w-10 h-10 border-2 border-choco dark:border-cream border-t-transparent" />
      </div>
    );

  if (blogPostsError)
    return (
      <p className="text-sm text-red-500 py-8 text-center">
        Error al cargar las publicaciones: {blogPostsError.message}
      </p>
    );

  return (
    <>
      <DashboardSection
        title="Blog"
        description="Gestiona tus publicaciones y artículos"
        count={blogPosts?.length ?? 0}
        action={
          <DashboardAddButton
            to="/dashboard/blog/new"
            label="Nueva Publicación"
          />
        }
        filters={
          <AdvancedFilter
            searchValue={searchTerm}
            onSearchChange={(v) => {
              setSearchTerm(v);
              setPage(1);
            }}
            onClear={() => {
              setSearchTerm("");
              setPage(1);
            }}
          />
        }
        isEmpty={filtered.length === 0}
        empty={
          <>
            <BookOpen className="size-12" />
            <p className="text-sm font-medium">
              No se encontraron publicaciones
            </p>
          </>
        }
      >
        {paginated.map((post) => {
          const status = statusConfig[post.status] ?? statusConfig.draft;

          return (
            <DashboardCard key={post.id}>
              {/* Imagen */}
              {post.image_url && (
                <div className="relative mb-1 h-36 overflow-hidden rounded-t-xl">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Status badge sobre imagen */}
                  <span
                    className={`absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
              )}

              {/* Título + status (si no hay imagen) */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {!post.image_url && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mb-1.5 ${status.className}`}
                    >
                      {status.label}
                    </span>
                  )}
                  <h3 className="font-semibold text-sm text-choco dark:text-cream line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                </div>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xs text-choco/60 dark:text-cream/60 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Slug */}
              <div className="flex items-center gap-1.5 text-[11px] text-choco/40 dark:text-cream/40">
                <FileText className="size-3 shrink-0" />
                <span className="truncate">{post.slug}</span>
              </div>

              {/* Footer — Fecha + acciones */}
              <div className="flex items-center justify-between pt-2 border-t border-cocoa/10 dark:border-cream/10">
                <div className="flex items-center gap-1 text-[11px] text-choco/40 dark:text-cream/40">
                  <Calendar className="size-3" />
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Sin publicar"}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Ver en public */}
                  {post.status === "published" && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="p-1.5 rounded-lg text-choco/50 dark:text-cream/50 hover:text-choco dark:hover:text-cream hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors"
                      title="Ver publicación"
                    >
                      <Eye className="size-4" />
                    </motion.button>
                  )}
                  {/* Editar */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(post)}
                    className="p-1.5 rounded-lg text-choco/50 dark:text-cream/50 hover:text-choco dark:hover:text-cream hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="size-4" />
                  </motion.button>
                  {/* Eliminar */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedPostId(post.id!);
                      setIsModalOpen(true);
                    }}
                    disabled={isDeletingPost}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    <Trash2 className="size-4" />
                  </motion.button>
                </div>
              </div>
            </DashboardCard>
          );
        })}

        {/* Paginación */}
        {filtered.length > ITEMS_PER_PAGE && (
          <div className="sm:col-span-2 xl:col-span-3 pt-2 border-t border-cocoa/20 dark:border-cream/10">
            <Pagination
              page={page}
              setPage={setPage}
              totalItems={filtered.length}
            />
          </div>
        )}
      </DashboardSection>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPostId(null);
        }}
        onConfirm={() => {
          if (selectedPostId) {
            deletePost(selectedPostId);
            setIsModalOpen(false);
            setSelectedPostId(null);
          }
        }}
        title="Eliminar publicación"
        message="¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isConfirming={isDeletingPost}
      />
    </>
  );
};