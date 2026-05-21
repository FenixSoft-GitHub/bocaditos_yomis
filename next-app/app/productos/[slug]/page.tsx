import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { Database } from "@/types/supabase";
import { createStaticClient } from "@/lib/supabase/static";
import { AddToCartButton } from "@/components/features/AddToCartButton";

// 1️⃣ Tipo explícito para la query relacional
type ProductWithCategory = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { id: string; name: string; slug: string | null } | null;
};

function formatPrice(price: string): string {
  const num = parseFloat(price);
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  // Tipado explícito del resultado
  const { data } = await supabase
    .from("products")
    .select("name, description, image_url")
    .eq("slug", slug)
    .single();

  // Casting seguro a tipo conocido
  const product = data as {
    name: string;
    description: string;
    image_url: string[] | null;
  } | null;

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: `${product.name} | Bocaditos Yomis`,
    description: product.description,
    openGraph: {
      images: product.image_url?.[0] || [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // 2️⃣ Query tipada explícitamente
  const { data: product, error } = (await supabase
    .from("products")
    .select(
      `
      *,
      categories:category_id (
        id,
        name,
        slug
      )
    `,
    )
    .eq("slug", slug)
    .single()) as { data: ProductWithCategory | null; error: Error | null };

  if (error || !product) {
    notFound();
  }

  // 3️ Productos relacionados también tipados
  const { data: relatedProducts } = (await supabase
    .from("products")
    .select(
      `
      *,
      categories:category_id (
        id,
        name
      )
    `,
    )
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4)) as { data: ProductWithCategory[] | null; error: Error | null };

  return (
    <main className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex text-sm text-gray-400">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/categorias/${product.categories?.slug || "todos"}`}
              className="hover:text-blue-400 transition-colors"
            >
              {product.categories?.name || "Categoría"}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
              {product.image_url && product.image_url.length > 0 ? (
                <Image
                  src={product.image_url[0]}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  Sin imagen disponible
                </div>
              )}
            </div>

            {product.image_url && product.image_url.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.image_url.map((img: string, index: number) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info del producto */}
          <div className="space-y-6">
            {product.categories && (
              <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full">
                {product.categories.name}
              </span>
            )}

            <h1 className="text-4xl font-bold text-white">{product.name}</h1>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-green-400">
                {formatPrice(product.price)}
              </span>
              {product.stock !== null &&
                product.stock > 0 &&
                product.stock < 10 && (
                  <span className="text-orange-400 text-sm">
                    ¡Solo {product.stock} disponibles!
                  </span>
                )}
              {product.stock === 0 && (
                <span className="text-red-400 text-sm font-medium">
                  Agotado
                </span>
              )}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              {product.description}
            </p>
            <AddToCartButton product={product} />
          </div>
        </div>

        {/* Relacionados */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/productos/${related.slug}`}
                  className="group border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 bg-gray-900"
                >
                  <div className="aspect-video bg-gray-800 overflow-hidden">
                    {related.image_url && related.image_url.length > 0 ? (
                      <Image
                        src={related.image_url[0]}
                        alt={related.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-blue-400 transition-colors">
                      {related.name}
                    </h3>
                    <p className="text-green-400 font-bold mt-1">
                      {formatPrice(related.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  // Usar cliente estático (sin cookies)
  const supabase = createStaticClient();

  // Query con casting explícito para evitar el error 'never'
  const { data: products } = (await supabase
    .from("products")
    .select("slug")) as {
    data: { slug: string }[] | null;
    error: Error | null;
  };

  return products?.map((p) => ({ slug: p.slug })) || [];
}
