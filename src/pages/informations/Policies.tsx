import markdownContent from "@/constants/Policies.md?raw";
import MarkdownPage from "@/components/shared/MarkdownPage";

const Policies = () => (
  <MarkdownPage
    markdown={markdownContent}
    imageSrc="/img/blog/Policies.avif"
    imageAlt="Políticas de privacidad"
  />
);

export default Policies;