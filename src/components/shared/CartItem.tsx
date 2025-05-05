import { LuMinus, LuPlus } from "react-icons/lu";
import { formatPrice } from "@/helpers";
import { useCartStore } from "@/store/cart.store";
import { Trash } from "lucide-react";

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string[];
}

interface Props {
  item: ICartItem;
}

export const CartItem = ({ item }: Props) => {
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const increment = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  const decrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  return (
    <li className="flex justify-between items-center gap-5">
      <div className="flex">
        <img
          src={item.image_url[0]}
          alt={item.name}
          className="size-18 object-cover rounded-lg"
        />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex justify-between gap-1.5">
          <p className="font-semibold text-sm">{item.name}</p>
          <p className="text-sm font-medium">{formatPrice(item.price)}</p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center justify-between gap-5 px-2 py-1 border border-cocoa/70 dark:border-cream/60 dark:bg-cream/20 bg-cocoa/10 rounded-full w-1/2 lg:w-1/3">
            <button onClick={decrement} disabled={item.quantity === 1}>
              <LuMinus size={15} />
            </button>
            <span className="text-sm">{item.quantity}</span>
            <button onClick={increment}>
              <LuPlus size={15} />
            </button>
          </div>

          <button
            className="flex gap-1 justify-center items-center hover:bg-cocoa/20 rounded-lg px-3 py-1 underline font-medium text-[10px]"
            onClick={() => removeItem(item.productId)}
          >
            <Trash size={15} />
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
};
