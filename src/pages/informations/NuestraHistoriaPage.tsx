import markdownContent from "@/constants/NuestraHistoria.md?raw";
import MarkdownPage from "@/components/shared/MarkdownPage";

const NuestraHistoriaPage = () => (
  <MarkdownPage
    markdown={markdownContent}
    imageSrc="/img/blog/nuestra-historia.avif"
    imageAlt="Imagen de Macarrones con una Rosa"
  />
);

export default NuestraHistoriaPage;