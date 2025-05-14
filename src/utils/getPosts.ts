import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import yaml from "js-yaml";

// Definimos los tipos para el frontmatter y el post completo
interface Frontmatter {
  title: string;
  date: string;
  slug: string;
  excerpt?: string; // Opcional
  author?: string; // Opcional
  tags?: string[];
  [key: string]: unknown; // Permite otras propiedades
}

interface BlogPost {
  slug: string;
  frontmatter: Frontmatter;
  contentHtml: string;
}

// Usamos import.meta.glob para importar todos los archivos .md
const modules = import.meta.glob("/src/content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const posts: BlogPost[] = [];

// Procesamos cada archivo
for (const path in modules) {
  const fullContent = modules[path] as string; // El contenido completo del archivo // *** L\u00F3gica para extraer el frontmatter manualmente ***

  let frontmatterNode: string | undefined;
  let markdownContent = fullContent;

  const frontmatterMatch = fullContent.match(
    /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/
  );

  if (frontmatterMatch && frontmatterMatch[1]) {
    frontmatterNode = frontmatterMatch[1]; // Captura el contenido entre los --- // Elimina el frontmatter del contenido para parsear solo Markdown
    markdownContent = fullContent.substring(frontmatterMatch[0].length);
  } else {
    // Si no se encuentra un bloque de frontmatter v\u00E1lido
    console.error(
      `Error: El archivo ${path} no tiene un bloque de frontmatter v\u00E1lido.`
    );
    continue; // Saltar este archivo
  } // *** Fin de la l\u00F3gica manual ***
  try {
    // Parsear el Frontmatter YAML
    const frontmatter = yaml.load(frontmatterNode) as Frontmatter; // console.log(`DEBUG YAML Output para ${path}:`, frontmatter); // Log opcional // Pipeline de Unified: Ahora solo parseamos el contenido Markdown
    const processor = unified()
      .use(remarkParse) // Parsear solo el contenido Markdown // Ya no necesitamos remarkFrontmatter aqu\u00ED
      .use(remarkRehype) // Convierte de remark (Markdown AST) a rehype (HTML AST)
      .use(rehypeStringify); // Serializa rehype AST a HTML // Procesamos solo el contenido Markdown

    const file = processor.processSync(markdownContent); // El contenido HTML ahora est\u00E1 en file.value

    const contentHtml = String(file); // Validar que el frontmatter y el slug existan

    // Aseguramos que frontmatter sea un objeto antes de acceder a slug
    if (!frontmatter || typeof frontmatter !== "object" || !frontmatter.slug) {
      console.error(
        `Error: El archivo ${path} tiene frontmatter inválido o le falta 'slug'.`,
        frontmatter
      );
      continue;
    }

    posts.push({
      slug: frontmatter.slug,
      frontmatter: frontmatter,
      contentHtml: contentHtml,
    }); // console.log(`DEBUG Post agregado exitosamente para ${path} con slug:`, frontmatter.slug); // Log opcional
  } catch (error) {
    // Esto atrapar\u00E1 errores del parseo YAML o de la pipeline de Unified
    console.error(`Error procesando el archivo ${path}:`, error);
  }
}

// Opcional: Ordenar los posts por fecha (del m\u00E1s reciente al m\u00E1s antiguo)
posts.sort(
  (a, b) =>
    new Date(b.frontmatter.date).getTime() -
    new Date(a.frontmatter.date).getTime()
);

// *** L\u00F3gica para extraer etiquetas \u00FAnicas ***
const allTags: string[] = [];
const tagsSet = new Set<string>(); // Usamos un Set para obtener etiquetas \u00FAnicas f\u00E1cilmente

posts.forEach(post => {
  if (post.frontmatter.tags && Array.isArray(post.frontmatter.tags)) {
    post.frontmatter.tags.forEach(tag => {
      tagsSet.add(tag.toLowerCase()); // A\u00F1adimos la etiqueta en min\u00FAs\u00ACculas al Set
    });
  }
});

// Convertimos el Set a un array y lo ordenamos alfab\u00E9ticamente
allTags.push(...Array.from(tagsSet).sort());

// Exportamos los posts procesados
export const blogPosts = posts;
export const availableTags = allTags; 

// Funci\u00F3n para encontrar un post por slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}