import { formatPrice } from "@/helpers";
import { useCartStore } from "@/store/cart.store";
import { Separator } from "../shared/Separator";

export const ItemsCheckout = () => {
  const cartItems = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount);

  return (
    <div className="flex flex-col gap-4">
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <li key={item.productId} className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={item.image_url[0]}
                alt={item.name}
                className="size-16 object-cover rounded-lg border border-cocoa/20 dark:border-cream/10"
              />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-choco dark:bg-cream text-cream dark:text-oscuro text-[10px] font-bold flex items-center justify-center shadow">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-2">{item.name}</p>
              <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold shrink-0">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>
      <Separator />
      <div className="flex justify-between items-center font-bold text-base">
        <span>Total</span>
        <span className="text-lg">{formatPrice(totalAmount)}</span>
      </div>
      <Separator />
    </div>
  );
};
