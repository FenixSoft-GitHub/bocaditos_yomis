import { Product } from "@/interfaces/product.interface";
import { FaCartPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Tag from "@/components/shared/Tag";
import { formatPrice } from "@/helpers";
import { useCartStore } from "@/store/cart.store";
import toast from "react-hot-toast";

interface CardProductProps {
  product: Product; 
}

export const CardProduct = ({ product }: CardProductProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if ((product?.stock ?? 0) > 0) {
      addItem({
        productId: product.id,
        name: product.name,
        image_url: product.image_url,
        price: product.price,
        quantity: 1,
      });
      toast.success("Producto añadido al carrito", {
        position: "bottom-right",
      });
    } else {
      toast.error("Producto agotado", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="group h-full flex flex-col justify-between border border-cocoa/50 dark:border-cocoa/50 rounded-2xl bg-cream overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-choco dark:text-cream dark:bg-fondo-dark">
      <Link
        to={`/products/${product.slug}`}
        className="block relative w-full aspect-square overflow-hidden"
      >
        <img
          src={product.image_url[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
        <h3 className="text-base font-semibold line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-oscuro dark:text-mint">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddClick}
            disabled={product.stock === 0}
            className={`w-fit flex items-center justify-center rounded-full transition-all 
                ${
                  product.stock === 0
                    ? "bg-cream/80 cursor-not-allowed p-1 transition-all duration-300 ease-in-out hover:scale-105"
                    : "bg-choco/90 text-cream dark:bg-cream/70 dark:text-choco hover:bg-choco dark:hover:bg-cream hover:scale-105 active:scale-95 p-3"
                }`}
          >
            {product.stock === 0 ? (
              <Tag contentTag="agotado" />
            ) : (
              <FaCartPlus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
