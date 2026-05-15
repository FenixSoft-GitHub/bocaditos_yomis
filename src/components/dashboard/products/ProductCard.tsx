import { memo } from "react";
import { formatDate, formatPrice } from "@/helpers";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { Tag, Calendar, AlertTriangle } from "lucide-react";

// ✅ Interfaz corregida
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number | null;
    image_url: string[];
    created_at: string | null;
    category_id: string;
    description: string;
    slug: string;
    updated_at: string | null;
    categories: {
      created_at: string | null;
      description: string;
      id: string;
      name: string;
    };
    discounts: Array<{
      created_at: string;
      discount_type: string;
      ends_at: string;
      id: string;
      product_id: string;
      starts_at: string;
      value: number;
    }>;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// ✅ Función auxiliar para verificar si el descuento está activo
const checkDiscountActive = (discount: ProductCardProps['product']['discounts'][0] | undefined): boolean => {
  if (!discount) return false;
  
  const now = new Date();
  const startsAt = discount.starts_at ? new Date(discount.starts_at) : null;
  const endsAt = discount.ends_at ? new Date(discount.ends_at) : null;
  
  const isValidDate = (!startsAt || startsAt <= now) && (!endsAt || endsAt >= now);
  return isValidDate;
};

// ✅ Función auxiliar para calcular precio con descuento
const calculateDiscountedPrice = (originalPrice: number, discount: ProductCardProps['product']['discounts'][0] | undefined): number => {
  if (!discount) return originalPrice;
  if (!checkDiscountActive(discount)) return originalPrice;
  
  if (discount.discount_type === "percentage") {
    return originalPrice * (1 - discount.value / 100);
  } else {
    return originalPrice - discount.value;
  }
};

const ProductCardComponent = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const stock = product.stock ?? 0;
  const isOutOfStock = stock === 0;
  
  const activeDiscount = product.discounts[0];
  const hasDiscount = checkDiscountActive(activeDiscount);
  const finalPrice = calculateDiscountedPrice(product.price, activeDiscount);

  return (
    <DashboardCard className="gap-1 m-0.5">
      {/* Imagen + acciones */}
      <div className="flex items-start gap-2">
        <img
          src={product.image_url[0] || "/img/misc/fallback-product.avif"}
          alt={product.name}
          className="size-16 rounded-lg object-cover border border-cocoa/20 dark:border-cream/10 shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-choco dark:text-cream line-clamp-2 leading-snug">
            {product.name}
          </p>
          <span className="inline-flex items-center gap-1 mt-1 text-xs text-choco/50 dark:text-cream/50">
            <Tag className="size-3" />
            {product.categories.name}
          </span>
        </div>
        <DropdownMenu
          onEdit={() => onEdit(product.id)}
          onDelete={() => onDelete(product.id)}
        />
      </div>

      {/* Precio + Stock */}
      <div className="flex items-center justify-between pt-2 border-t border-cocoa/10 dark:border-cream/10">
        <div className="flex flex-col">
          {hasDiscount ? (
            <>
              <span className="text-xs line-through text-choco/70 dark:text-cream/60">
                {formatPrice(product.price)}
              </span>
              <span className="text-base font-bold text-dorado">
                {formatPrice(finalPrice)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-choco dark:text-cream">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isOutOfStock
              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          }`}
        >
          {isOutOfStock && <AlertTriangle className="size-3" />}
          {isOutOfStock ? "Agotado" : `Stock: ${stock}`}
        </div>
      </div>

      {/* Fecha */}
      <div className="flex items-center gap-1 text-[11px] text-choco/40 dark:text-cream/40">
        <Calendar className="size-3" />
        {formatDate(product.created_at as string)}
      </div>
    </DashboardCard>
  );
};

export const ProductCard = memo(ProductCardComponent);
ProductCard.displayName = "ProductCard";
