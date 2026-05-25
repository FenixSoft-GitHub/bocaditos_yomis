import React, { useState, useMemo } from "react";
import { useBlogPosts } from "@/hooks";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react"; // 🔹 Quitamos Search y RotateCcw
import { SEOHead } from "@/components/seo/SEOHead";
import { breadcrumbSchema } from "@/components/seo/schemas";
import { FadeIn, StaggerList, StaggerItem } from "@/components/animations";
import { Pagination } from "@/components/shared/Pagination";
import { BlogListSkeleton } from "@/components/shared/skeletons/BlogListSkeleton";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter"; // 🔹 Importamos el componente

const ITEMS_PER_PAGE = 9;

const BlogPublicListPage: React.FC = () => {
  const {
    blogPosts: posts,
    isLoadingBlogPosts: isLoading,
    blogPostsError: isError,
  } = useBlogPosts();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // 🔹 Handlers simplificados
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setPage(1);
  };

  // 🔹 Filtrado solo por título y autor
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    const published = posts.filter((p) => p.status === "published");
    if (!searchTerm.trim()) return published;

    const term = searchTerm.toLowerCase();
    return published.filter((post) => {
      const matchTitle = post.title?.toLowerCase().includes(term);
      const matchAuthor = post.display_author_name
        ?.toLowerCase()
        .includes(term);
      return matchTitle || matchAuthor;
    });
  }, [posts, searchTerm]);

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, page]);

  if (isError)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        Error al cargar el blog
      </div>
    );

  return (
    <>
      <SEOHead
        title="Blog"
        description="Recetas, secretos de cocina y tips de pastelería artesanal de Bocaditos Yomi's."
        canonical="/blog"
        schema={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />
      <div className="text-choco dark:text-cream">
        {/* Hero (sin cambios) */}
        <div className="relative w-full h-screen flex justify-end items-center">
          <img
            src="/img/blog/blog.avif"
            alt="Blog de Bocaditos Yomi's"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-fondo dark:from-fondo-dark to-transparent" />
          <div className="relative max-w-[700px] text-cream flex flex-col gap-5 text-end py-20 px-4 lg:py-40 lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-cream/70">
              Bocaditos Yomi's · Blog
            </p>
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] leading-tight">
              Inspiración dulce
            </h1>
            <p className="text-sm md:text-lg text-cream/90 leading-relaxed">
              Recetas irresistibles, secretos de cocina y tips profesionales
              para llevar tu pasión por lo dulce al siguiente nivel. Compartimos
              contigo nuestro amor por los sabores auténticos, las texturas
              perfectas y la creatividad en cada detalle.
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="container mx-auto px-4 py-12">
          {/* Header + Buscador Integrado 🔹 */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">Artículos publicados</h2>
                <p className="text-sm text-choco/60 dark:text-cream/60 mt-0.5">
                  {filteredPosts.length}{" "}
                  {filteredPosts.length === 1 ? "artículo" : "artículos"}
                  {searchTerm ? " encontrados" : " disponibles"}
                </p>
              </div>

              {/* Reemplazamos el input manual por AdvancedFilter 🔹 */}
              <div className="w-full sm:max-w-sm">
                <AdvancedFilter
                  searchValue={searchTerm}
                  onSearchChange={handleSearchChange}
                  onClear={handleClear}
                />
              </div>
            </div>
          </FadeIn>

          {isLoading ? (
            <BlogListSkeleton />
          ) : paginatedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-choco/40 dark:text-cream/40">
              <BookOpen className="size-14" />
              <div className="text-center space-y-1">
                <p className="font-semibold text-choco dark:text-cream">
                  {searchTerm
                    ? "No encontramos artículos"
                    : "No hay artículos publicados aún"}
                </p>
                <p className="text-sm">
                  {searchTerm
                    ? "Intenta con otros términos"
                    : "Vuelve pronto para leer nuestro contenido"}
                </p>
              </div>
              {searchTerm && (
                <button
                  onClick={handleClear}
                  className="btn-primary px-5 py-2 rounded-full text-sm"
                >
                  Ver todos los artículos
                </button>
              )}
            </div>
          ) : (
            <StaggerList
              key={`${page}-${searchTerm}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
            >
              {paginatedPosts.map((post) => (
                <StaggerItem key={post.id}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col h-full bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {post.image_url ? (
                      <div className="relative h-48 overflow-hidden shrink-0">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          style={{
                            maskImage:
                              "linear-gradient(black 60%, transparent)",
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-choco/10 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-48 bg-cocoa/10 dark:bg-cream/5 flex items-center justify-center shrink-0">
                        <BookOpen className="size-12 text-choco/20 dark:text-cream/20" />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                      <h3 className="font-bold text-base leading-snug text-choco dark:text-cream group-hover:text-cocoa dark:group-hover:text-cocoa transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs text-choco/60 dark:text-cream/60 line-clamp-3 leading-relaxed flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-cocoa/10 dark:border-cream/10 mt-auto">
                        <div className="flex flex-col gap-1">
                          {post.display_author_name && (
                            <div className="flex items-center gap-1 text-[11px] text-choco/50 dark:text-cream/50">
                              <User className="size-3" />
                              <span>{post.display_author_name}</span>
                            </div>
                          )}
                          {post.published_at && (
                            <div className="flex items-center gap-1 text-[11px] text-choco/50 dark:text-cream/50">
                              <Calendar className="size-3" />
                              <span>
                                {format(
                                  new Date(post.published_at),
                                  "d MMM yyyy",
                                  { locale: es },
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-choco dark:text-cream group-hover:gap-2 transition-all duration-200">
                          Leer <ArrowRight className="size-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerList>
          )}

          {filteredPosts.length > ITEMS_PER_PAGE && (
            <div className="my-5 pt-4 border-t border-cocoa/10 dark:border-cream/10">
              <Pagination
                page={page}
                setPage={setPage}
                totalItems={filteredPosts.length}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPublicListPage;