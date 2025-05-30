
import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa6";
import { formatDate } from '@/helpers';

interface BlogPost {
  id: string; // UUID de la publicación
  title: string;
  slug: string;
  content_markdown: string;
  author_id: string; // UUID del autor, requerido
  image_url: string | null; // URL de la imagen, opcional en la DB (puede ser null)
  status: "draft" | "published" | "archived"; // Estado de la publicación, requerido en la DB
  published_at: string | null; // Fecha de publicación, opcional en la DB (puede ser null)
  created_at: string; // Fecha de creación
  updated_at: string; // Fecha de última actualización
  display_author_name: string | null; //
  excerpt: string | null; // Extracto de la publicación, opcional en la DB (puede ser null)
  classCol: string;
  classMax: string;
  imageClass?: string; // Clase CSS para la imagen, opcional
}

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <div
      key={post.slug}
      className={`ease-in-out hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl bg-cream dark:bg-oscuro p-0 flex flex-col ${post.classCol}`}
    >
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-66 object-cover "
          style={{ maskImage: "linear-gradient(black 70%, transparent)" }}
        />
      )}

      <div className="flex flex-col  h-full p-4 flex-1">
        <div>
          <h2 className="text-xl font-semibold text-choco dark:text-cream mb-2">
            <Link
              to={`/blog/${post.slug}`}
              className="hover:text-oscuro dark:hover:text-dorado transition-colors"
            >
              {post.title}
            </Link>
          </h2>

          <div className="flex items-center text-sm text-choco dark:text-cream/60 mb-4">
            <span>{formatDate(post.published_at as string)}</span>
            <span className="mx-2">•</span>
            <span>{post.display_author_name}</span>
            <span className="mx-2">•</span>
            <span>{post.status}</span>
          </div>

          <div>
            <p className="text-choco dark:text-cream text-xs md:text-base mb-2 line-clamp-4">
              {post.excerpt ? post.excerpt : "No hay contenido disponible."}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 bg-cocoa/20 px-3 py-1 rounded-md text-sm text-oscuro dark:text-amber-400 dark:hover:text-dorado hover:underline font-medium hover:scale-105 transform-all ease-in-out duration-300"
          >
            Leer más
            <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;

// import { Link } from 'react-router-dom';
// import { FaArrowRight } from "react-icons/fa6";

// interface BlogPost {
//   title: string;
//   date: string;
//   author: string;
//   slug: string;
//   tags?: string[];
//   imageUrl?: string;
//   excerpt?: string;
//   classCol: string;
//   classMax: string;
// }

// const BlogPostCard = ({ post }: { post: BlogPost }) => {
//   return (
//     <div
//       key={post.slug}
//       className={`col-span-10 ${post.classCol} bg-cream dark:bg-oscuro rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col`}
//     >
//       {post.imageUrl && (
//         <img
//           src={post.imageUrl}
//           alt={post.title}
//           className="w-full h-66 object-cover"
//           style={{ maskImage: "linear-gradient(black 70%, transparent)" }}
//         />
//       )}

//       <div className="flex flex-col  h-full p-4 flex-1">
//         <div>
//           <h2 className="text-xl font-semibold text-choco dark:text-cream mb-1">
//             <Link
//               to={`/blog/${post.slug}`}
//               className="hover:text-oscuro dark:hover:text-dorado transition-colors"
//             >
//               {post.title}
//             </Link>
//           </h2>

//           <div className="flex items-center text-sm text-choco dark:text-gray-300 mb-2">
//             <span>{post.date}</span>
//             <span className="mx-2">•</span>
//             <span>{post.author}</span>
//           </div>

//           {post.excerpt && (
//             <p
//               className={`${post.classMax} text-choco dark:text-gray-300 text-xs md:text-base mb-2 line-clamp-3`}
//             >
//               {post.excerpt}
//             </p>
//           )}

//           {post.tags && (
//             <div className="flex flex-wrap gap-2 mb-2">
//               {post.tags.map((tag) => (
//                 <span
//                   key={tag}
//                   className="px-3 py-1 text-sm text-oscuro rounded-full bg-butter dark:bg-choco/50  dark:text-cream shadow-md capitalize"
//                 >
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="mt-auto">
//           <Link
//             to={`/blog/${post.slug}`}
//             className="inline-flex items-center gap-2 bg-cocoa/20 px-3 py-1 rounded-md text-sm text-oscuro dark:text-amber-400 dark:hover:text-dorado hover:underline font-medium hover:scale-105 transform-all ease-in-out duration-300"
//           >
//             Leer más
//             <FaArrowRight className="w-3.5 h-3.5" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogPostCard;
