// import { LuMinus, LuPlus } from "react-icons/lu";
import { formatPrice } from "@/helpers";
import { useCartStore } from "@/store/cart.store";
import { Trash } from "lucide-react";
import InputNumber from "./InputNumber";


export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string[];
  stock: number | null;
}

interface Props {
  item: ICartItem;
}

export const CartItem = ({ item }: Props) => {
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  // Función para manejar el cambio de cantidad desde InputNumber
  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.productId, newQuantity);
  };

  // Calcular el importe total para este artículo (precio * cantidad)
  const itemTotal = item.price * item.quantity;

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

        {/* Nueva sección para mostrar el subtotal del artículo */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center justify-between gap-1 w-fit">
            <InputNumber
              value={item.quantity}
              min={1}
              max={item?.stock !== null ? item.stock : 999}
              onChange={handleQuantityChange}
              className="w-25 text-sm"
              classNameIcon="size-3"
            />
            <button
              className="flex gap-1 justify-center items-center hover:bg-cocoa/20 rounded-lg px-3 py-1 underline font-medium text-[10px] text-red-500 hover:text-red-600 transition-colors"
              onClick={() => removeItem(item.productId)}
            >
              <Trash size={15} />
              Eliminar
            </button>
          </div>
          {/* Muestra el subtotal del artículo */}
          <p className="text-sm font-semibold text-choco dark:text-cream">
            Valor total: {formatPrice(itemTotal)}
          </p>
        </div>
      </div>
    </li>
  );
};
