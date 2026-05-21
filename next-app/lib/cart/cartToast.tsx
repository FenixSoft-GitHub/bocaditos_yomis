// lib/toast.tsx (opcional)
import toast from "react-hot-toast";

export const cartToast = {
  success: (productName: string, quantity: number, image?: string) => {
    return toast.success(
      (t) => (
        <div className="flex items-center gap-3">
          {image && (
            <img
              src={image}
              alt={productName}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <p className="font-semibold">¡Agregado!</p>
            <p className="text-sm text-gray-300">
              {quantity}x {productName}
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      ),
      { duration: 2500 },
    );
  },
  error: (message: string) => {
    return toast.error(message, { duration: 3000 });
  },
};
