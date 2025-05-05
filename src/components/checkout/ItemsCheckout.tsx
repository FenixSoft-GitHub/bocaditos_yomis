import { formatPrice } from "@/helpers";
import { useCartStore } from "@/store/cart.store";
import { Separator } from "../shared/Separator";

export const ItemsCheckout = () => {
  const cartItems = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount);
  
  return (
    <div>
      <ul className="space-y-5 mb-5">
        {cartItems.map((item) => (
          <li
            key={item.productId}
            className="flex justify-between items-center gap-5"
          >
            <div className="flex relative border border-choco dark:border-cocoa/70 rounded-lg">
              <img
                src={item.image_url[0]}
                alt={item.name}
                className="size-16 object-cover rounded-lg"
              />
              <span className="w-5 h-5 rounded-full bg-choco/90 text-cream dark:bg-cream dark:text-oscuro font-semibold flex items-center justify-center text-xs absolute -right-1 -top-2">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex justify-between">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm font-medium mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Separator />

      <div className="flex justify-between font-semibold text-lg">
        <p>Total:</p>
        <p>{formatPrice(totalAmount)}</p>
      </div>

      <Separator />
    </div>
  );
};
