import markdownContent from "@/constants/NuestraHistoria.md?raw";
import MarkdownPage from "@/components/shared/MarkdownPage";

const NuestraHistoriaPage = () => (
  <MarkdownPage
    markdown={markdownContent}
    imageSrc="/img/blog/blog1.avif"
    imageAlt="Imagen de Macarrones con una Rosa"
  />
);

export default NuestraHistoriaPage;