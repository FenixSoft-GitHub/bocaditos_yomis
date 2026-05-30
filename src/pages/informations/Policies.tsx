import markdownContent from "@/constants/markdown/Policies.md?raw";
import MarkdownPage from "@/components/shared/MarkdownPage";

const Policies = () => (
  <MarkdownPage
    markdown={markdownContent}
    imageSrc="/img/blog/Policies.avif"
    imageAlt="Políticas de privacidad"
  />
);

export default Policies;