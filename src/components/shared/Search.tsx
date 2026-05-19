import { useState, useEffect } from "react";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import { useGlobalStore } from "@/store/global.store";
import { formatPrice } from "@/helpers";
import { searchProducts } from "@/actions/product";
import { Product } from "@/interfaces/product.interface";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getDiscountedPrice,
  getDiscountPercentage,
  isDiscountActive,
} from "@/lib/discount";

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const closeSheet = useGlobalStore((state) => state.closeSheet);
  const navigate = useNavigate();

  // useEffect para implementar el "debouncing"
  useEffect(() => {
    // Si el término de búsqueda está vacío, limpia los resultados inmediatamente
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true); // Indica que la búsqueda está en curso

    // Configura un temporizador para ejecutar la búsqueda después de un retardo
    const timer = setTimeout(async () => {
      try {
        const products = await searchProducts(searchTerm);
        setSearchResults(products);
      } catch (error) {
        console.error("Error durante la búsqueda en línea:", error);
        setSearchResults([]); // Limpiar resultados en caso de error
      } finally {
        setIsSearching(false); // La búsqueda ha terminado
      }
    }, 300); // Retardo de 300ms (puedes ajustarlo)

    // Función de limpieza: se ejecuta si el componente se desmonta
    // o si el 'searchTerm' cambia antes de que el temporizador termine.
    return () => clearTimeout(timer);
  }, [searchTerm]); // Este efecto se ejecuta cada vez que 'searchTerm' cambia

  return (
    <div className="flex flex-col h-full bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      {/* BARRA DE BÚSQUEDA - HEADER */}
      <div className="py-4 px-4 flex gap-3 items-center border-b border-cocoa/20 dark:border-cream/10 shink-0">
        <div className="flex gap-3 items-center flex-1 bg-cocoa/10 dark:bg-cream/10 rounded-full px-4 py-2">
          <SearchIcon className="size-4 text-choco/50 dark:text-cream/50 shrink-0" />
          <input
            type="text"
            placeholder="Buscar productos..."
            autoFocus
            className="outline-none w-full text-sm bg-transparent placeholder:text-choco/40 dark:placeholder:text-cream/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isSearching && (
            <Loader2 className="size-4 text-choco/40 dark:text-cream/40 animate-spin shrink-0" />
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={closeSheet}
          className="p-1.5 rounded-full bg-choco/10 dark:bg-cream/10 hover:bg-choco/20 dark:hover:bg-cream/20 transition-colors shrink-0 cursor-pointer"
          aria-label="Cerrar búsqueda"
        >
          <X className="size-4" />
        </motion.button>
      </div>

      {/* RESULTADOS DE Busqueda */}
      <div className="p-4 pb-24 overflow-y-auto flex-1">
        {searchResults.length > 0 ? (
          <ul className="space-y-2">
            {searchResults.map((product) => {
              const activeDiscount =
                product.discount && isDiscountActive(product.discount)
                  ? product.discount
                  : null;
              const discountedPrice = activeDiscount
                ? getDiscountedPrice(product.price, activeDiscount)
                : product.price;
              const discountPct = activeDiscount
                ? getDiscountPercentage(product.price, activeDiscount)
                : null;

              return (
                <li key={product.id}>
                  <button
                    className="flex items-center gap-3 w-full text-left p-2.5 rounded-xl group dark:hover:bg-cream/10 transition-colors"
                    onClick={() => {
                      navigate(`/products/${product.slug}`);
                      closeSheet();
                    }}
                  >
                    <img
                      src={product.image_url[0]}
                      alt={product.name}
                      className="size-14 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1 group-hover:text-cocoa transition-colors">
                        {product.name}
                      </p>

                      <p className="text-xs text-choco/50 dark:text-cream/50 truncate mt-0.5">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        {/* <div className="flex items-center gap-2"> */}
                          {activeDiscount ? (
                            <>
                              <span className="text-sm line-through text-choco/40 dark:text-cream/40">
                                {formatPrice(product.price)}
                              </span>
                              <span className="text-sm font-bold text-dorado">
                                {formatPrice(discountedPrice)}
                              </span>
                              <span className="text-[10px] bg-dorado/20 text-choco dark:text-dorado font-semibold px-1.5 py-0.5 rounded-full">
                                -{discountPct}%
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold">
                              {formatPrice(product.price)}
                            </span>
                          )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : searchTerm.trim() !== "" && !isSearching ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <img
              src="/img/misc/NoResultItems2.webp"
              alt="No se encontraron resultados"
              className="w-3/4 rounded-lg opacity-80"
            />
            <p className="text-sm text-choco/50 dark:text-cream/50 text-center">
              No encontramos "<strong>{searchTerm}</strong>"
            </p>
          </div>
        ) : (
          !searchTerm && (
            // Mensaje inicial cuando el campo de búsqueda está vacío
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-choco/40 dark:text-cream/40">
              <SearchIcon className="size-10" />
              <p className="text-sm text-center">
                Escribe para buscar productos...
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
