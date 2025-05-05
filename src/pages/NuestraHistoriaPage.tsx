import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import markdownContent from '@/constants/NuestraHistoria.md?raw';
import { Link } from 'react-router-dom';
import { IoReturnUpBack } from 'react-icons/io5';

const NuestraHistoriaPage = () => {
  if (typeof markdownContent !== 'string') {
    console.error("Error: No se pudo cargar el contenido Markdown.");
    return <p>Error al cargar el contenido.</p>;
  }

  return (
    <div className="container mx-auto p-2 prose lg:prose-xl dark:prose-invert text-choco dark:text-cream">
      <div className="flex items-center gap-2 pt-24">
        <img
          className="rounded-lg"
          // srcSet="/img/blog/blog1.webp 2x, /img/blog/blog1.avif 1x"
          src="/img/blog/blog1.avif"
          alt="Imagen de Macarrones con una Rosa"
        />
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
      <div className="flex items-center gap-2 group justify-end">
        <Link
          to={"/about"}
          className="inline-flex items-center gap-2 text-oscuro dark:text-mint dark:hover:text-dorado hover:underline font-medium mb-6"
        >
          Regresar
          <IoReturnUpBack className="w-6 h-6 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
};

export default NuestraHistoriaPage;


