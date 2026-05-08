const SITE_URL = "https://bocaditosynomis.vercel.app";
const SITE_NAME = "Bocaditos Yomi's";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/LogoBocaditosYomis.avif`,
  description:
    "Tienda artesanal de snacks, golosinas y bocaditos. Productos frescos con envíos a todo el país.",
  servesCuisine: "Snacks y Golosinas",
  hasMenu: `${SITE_URL}/products`,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.url}`,
  })),
});

export const productSchema = (product: {
  name: string;
  description: string;
  image: string[];
  price: number;
  currency?: string;
  slug: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.image,
  url: `${SITE_URL}/products/${product.slug}`,
  brand: { "@type": "Brand", name: SITE_NAME },
  offers: {
    "@type": "Offer",
    price: product.price,
    priceCurrency: product.currency || "USD",
    availability: product.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    url: `${SITE_URL}/products/${product.slug}`,
    seller: { "@type": "Organization", name: SITE_NAME },
  },
  ...(product.rating && product.reviewCount
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
      }
    : {}),
});

export const blogPostSchema = (post: {
  title: string;
  description: string;
  image?: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.description,
  image: post.image || `${SITE_URL}/LogoBocaditosYomis.avif`,
  url: `${SITE_URL}/blog/${post.slug}`,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt || post.publishedAt,
  author: { "@type": "Organization", name: post.authorName || SITE_NAME },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/LogoBocaditosYomis.avif`,
    },
  },
});
