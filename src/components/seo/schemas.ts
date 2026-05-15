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

/**
 * Schema de producto para JSON-LD (Google Rich Results)
 * Compatible con la estructura de datos de Supabase
 */
export const productSchema = (product: {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string[];
  stock: number;
  slug: string;
  created_at?: string;
  discounts?: Array<{
    id: string;
    value: number;
    discount_type: "percentage" | "fixed";
    starts_at?: string;
    ends_at?: string;
  }>;
  categories?: {
    name: string;
  };
  rating?: number;
  reviewCount?: number;
}) => {
  // Calcular precio con descuento si aplica
  let currentPrice = product.price;
  let priceValidUntil: string | undefined;
  let hasActiveDiscount = false;

  if (product.discounts && product.discounts.length > 0) {
    const discount = product.discounts[0];
    const now = new Date();
    const startsAt = discount.starts_at ? new Date(discount.starts_at) : null;
    const endsAt = discount.ends_at ? new Date(discount.ends_at) : null;
    const isValidDate =
      (!startsAt || startsAt <= now) && (!endsAt || endsAt >= now);

    if (isValidDate) {
      hasActiveDiscount = true;
      if (discount.discount_type === "percentage") {
        currentPrice = product.price * (1 - discount.value / 100);
      } else {
        currentPrice = product.price - discount.value;
      }
      if (discount.ends_at) {
        priceValidUntil = new Date(discount.ends_at)
          .toISOString()
          .split("T")[0];
      }
    }
  }

  // Redondear a 2 decimales
  currentPrice = Math.round(currentPrice * 100) / 100;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description?.substring(0, 200) || "",
    image: product.image_url?.filter((img) => typeof img === "string") || [],
    url: `${SITE_URL}/products/${product.slug}`,
    sku: product.id,
    mpn: product.id,
    ...(product.categories?.name && {
      category: product.categories.name,
    }),
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      price: currentPrice.toFixed(2),
      priceCurrency: "PEN",
      priceValidUntil: priceValidUntil,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      ...(hasActiveDiscount && {
        hasMerchantReturn: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "PE",
          returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        },
      }),
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
  };
};

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

// const SITE_URL = "https://bocaditosynomis.vercel.app";
// const SITE_NAME = "Bocaditos Yomi's";

// export const organizationSchema = {
//   "@context": "https://schema.org",
//   "@type": "FoodEstablishment",
//   name: SITE_NAME,
//   url: SITE_URL,
//   logo: `${SITE_URL}/LogoBocaditosYomis.avif`,
//   description:
//     "Tienda artesanal de snacks, golosinas y bocaditos. Productos frescos con envíos a todo el país.",
//   servesCuisine: "Snacks y Golosinas",
//   hasMenu: `${SITE_URL}/products`,
// };

// export const websiteSchema = {
//   "@context": "https://schema.org",
//   "@type": "WebSite",
//   name: SITE_NAME,
//   url: SITE_URL,
//   potentialAction: {
//     "@type": "SearchAction",
//     target: {
//       "@type": "EntryPoint",
//       urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
//     },
//     "query-input": "required name=search_term_string",
//   },
// };

// export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
//   "@context": "https://schema.org",
//   "@type": "BreadcrumbList",
//   itemListElement: items.map((item, index) => ({
//     "@type": "ListItem",
//     position: index + 1,
//     name: item.name,
//     item: `${SITE_URL}${item.url}`,
//   })),
// });

// export const productSchema = (product: {
//   name: string;
//   description: string;
//   image: string[];
//   price: number;
//   currency?: string;
//   slug: string;
//   inStock: boolean;
//   rating?: number;
//   reviewCount?: number;
// }) => ({
//   "@context": "https://schema.org",
//   "@type": "Product",
//   name: product.name,
//   description: product.description,
//   image: product.image,
//   url: `${SITE_URL}/products/${product.slug}`,
//   brand: { "@type": "Brand", name: SITE_NAME },
//   offers: {
//     "@type": "Offer",
//     price: product.price,
//     priceCurrency: product.currency || "USD",
//     availability: product.inStock
//       ? "https://schema.org/InStock"
//       : "https://schema.org/OutOfStock",
//     url: `${SITE_URL}/products/${product.slug}`,
//     seller: { "@type": "Organization", name: SITE_NAME },
//   },
//   ...(product.rating && product.reviewCount
//     ? {
//         aggregateRating: {
//           "@type": "AggregateRating",
//           ratingValue: product.rating,
//           reviewCount: product.reviewCount,
//         },
//       }
//     : {}),
// });

// export const blogPostSchema = (post: {
//   title: string;
//   description: string;
//   image?: string;
//   slug: string;
//   publishedAt: string;
//   updatedAt?: string;
//   authorName?: string;
// }) => ({
//   "@context": "https://schema.org",
//   "@type": "BlogPosting",
//   headline: post.title,
//   description: post.description,
//   image: post.image || `${SITE_URL}/LogoBocaditosYomis.avif`,
//   url: `${SITE_URL}/blog/${post.slug}`,
//   datePublished: post.publishedAt,
//   dateModified: post.updatedAt || post.publishedAt,
//   author: { "@type": "Organization", name: post.authorName || SITE_NAME },
//   publisher: {
//     "@type": "Organization",
//     name: SITE_NAME,
//     logo: {
//       "@type": "ImageObject",
//       url: `${SITE_URL}/LogoBocaditosYomis.avif`,
//     },
//   },
// });
