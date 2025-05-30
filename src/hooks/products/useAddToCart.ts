import { useCartStore } from "@/store/cart.store";
import toast from "react-hot-toast";
import { Product } from "@/interfaces/product.interface";

export const useAddToCart = () => {
  const addItem = useCartStore((state) => state.addItem);

  const addToCart = (product: Product, price: number) => {
    if ((product?.stock ?? 0) > 0) {
      addItem({
        productId: product.id,
        name: product.name,
        image_url: product.image_url,
        price,
        quantity: 1,
        stock: product.stock,
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

  return { addToCart };
};
