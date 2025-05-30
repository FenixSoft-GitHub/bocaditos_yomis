import React, { useState, useMemo } from "react";
import { useBlogPosts } from "@/hooks"; // Este hook ahora traerá display_author_name
import { Loader } from "@/components/shared/Loader";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GrPowerReset } from "react-icons/gr";
import { GoSearch } from "react-icons/go";
import { getColSpan, getImageClass, getMaxHeight } from "@/utils/bento";

const BlogPublicListPage: React.FC = () => {
  const {
    blogPosts: posts,
    isLoadingBlogPosts: isLoading,
    blogPostsError: isError,
  } = useBlogPosts(); // Asumo que este hook ahora trae display_author_name directamente

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    let currentFilteredPosts = posts;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFilteredPosts = currentFilteredPosts.filter((post) => {
        const matchesTitle = post.title
          .toLowerCase()
          .includes(lowerCaseSearchTerm);
        const matchesAuthor = post.display_author_name
          ?.toLowerCase()
          .includes(lowerCaseSearchTerm); // <-- Usa display_author_name
        const postDate = post.published_at ? new Date(post.published_at) : null;
        const formattedDateForSearch = postDate
          ? format(postDate, "PPP", { locale: es }).toLowerCase()
          : "";
        const matchesDate =
          formattedDateForSearch.includes(lowerCaseSearchTerm);

        return matchesTitle || matchesAuthor || matchesDate;
      });
    }

    return currentFilteredPosts;
  }, [posts, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen mt-20">
        <Loader size={60} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10 mt-20">
        <p>Error al cargar los artículos del blog: {isError?.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* ... (Hero Section y Blog de la Pastelería H1) */}
      <div className="relative w-full h-screen flex justify-end items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat h-full bg-[url('/img/blog/blog.avif')] dark:mask-image-[linear-gradient(to_bottom,_black_80%,_transparent)] light:mask-image-[linear-gradient(to_bottom,_white_80%,_transparent)]"
          style={{
            maskImage: "linear-gradient(to bottom, black 80%, transparent)",
          }}
        />
        <div className="absolute inset-0 bg-black opacity-20" />

        <div className="relative max-w-[800px] flex flex-col text-end px-4 lg:px-12 gap-3.5 text-cream">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
            Bienvenido a nuestro Blog de Repostería, Pastelería y Panadería
          </h2>

          <div className="text-balance text-end text-sm tracking-wide md:text-xl ">
            <p>
              En este espacio encontrarás inspiración, secretos de cocina,
              recetas irresistibles y tips profesionales para que lleves tu
              pasión por lo dulce al siguiente nivel.
            </p>
            <p>
              Compartimos contigo nuestro amor por los sabores auténticos, las
              texturas perfectas y la creatividad en cada detalle.
            </p>
            <p>
              Ya seas un aficionado que da sus primeros pasos o un experto en
              busca de nuevas ideas, aquí descubrirás todo lo que necesitas para
              crear momentos inolvidables.
            </p>
            <p>
              ¡Prepárate para endulzar tu vida con{" "}
              <strong>Bocaditos Yomi's</strong>!
            </p>
          </div>
        </div>
      </div>

      <section className="max-w-[1400px] w-full mx-auto gap-4 lg:gap-10 text-pretty p-6 text-left sm:px-20 flex flex-col items-center justify-between md:px-12 lg:py-2">
        <div className="flex w-full items-center justify-between flex-col md:flex-row gap-4 text-choco dark:text-cream py-4">
          <h1 className="text-2xl md:text-4xl font-bold text-center drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
            Blog de la Pastelería
          </h1>

          <div className="relative flex items-center gap-3">
            <GoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-choco dark:text-cream/50 size-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por título, autor o fecha..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full text-sm border border-choco/70 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary dark:bg-fondo-dark dark:text-white text-choco"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-cream dark:text-choco hover:scale-110 transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer rounded-full bg-choco p-2 dark:bg-cream/70 w-auto h-fit shadow-lg"
                title="Limpiar filtro"
              >
                <GrPowerReset className="size-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1400px] grid lg:grid-cols-10 auto-rows-[32rem] gap-7 mx-auto md:p-12 my-1">
        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <BlogPostCard
              key={post.id}
              post={{
                ...post,
                classCol: getColSpan(i),
                classMax: getMaxHeight(i),
                imageClass: getImageClass(i),
              }}
            />
          ))
        ) : (
          <div className="col-span-full bg-cream dark:bg-cocoa/10 p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {posts && posts.length === 0
                ? "No hay artículos publicados en este momento."
                : "No se encontraron artículos que coincidan con tu búsqueda."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPublicListPage;
