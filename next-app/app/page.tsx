import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Database } from "@/types/supabase";

// 1️⃣ Tipo explícito para producto con categoría (relación)
type ProductWithCategory = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { id: string; name: string } | null;
};

function formatPrice(price: string): string {
  const num = parseFloat(price);
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export default async function HomePage() {
  const supabase = await createClient();

  // 2️⃣ Query con casting explícito al tipo definido
  const { data: products, error } = (await supabase
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
    .limit(8)) as { data: ProductWithCategory[] | null; error: Error | null };

  if (error) {
    console.error("Error cargando productos:", error);
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Bocaditos Yomis</h1>
        <p className="text-gray-400 mb-8">Deliciosos postres artesanales</p>

        {error ? (
          <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
            ❌ Error: {error.message}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => {
              // 3️⃣ Acceso seguro a la primera imagen
              const firstImage = product.image_url?.[0];

              return (
                <Link
                  key={product.id}
                  href={`/productos/${product.slug}`}
                  className="group border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 bg-gray-900"
                >
                  {/* Imagen optimizada con Next/Image */}
                  <div className="aspect-video bg-gray-800 overflow-hidden relative">
                    {firstImage ? (
                      <Image
                        src={firstImage}
                        alt={product.name}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={index < 3}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  {/* Información */}
                  <div className="p-5">
                    {product.categories && (
                      <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                        {product.categories.name}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold mt-2 mb-2 group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">
                        {formatPrice(product.price)}
                      </span>
                      {product.stock !== null && product.stock < 10 && (
                        <span className="text-xs text-orange-400">
                          Stock: {product.stock}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900/50 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-lg">
              No hay productos disponibles
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
