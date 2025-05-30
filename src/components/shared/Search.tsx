import { useState, useEffect } from "react"; // Importa useEffect
import { HiOutlineSearch } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useGlobalStore } from "@/store/global.store";
import { formatPrice } from "@/helpers";
import { searchProducts } from "@/actions/product"; // Asegúrate de que la ruta sea correcta y que searchProducts devuelva Product[]
import { Product } from "@/interfaces/product.interface"; // Importa la interfaz Product unificada
import { useNavigate } from "react-router-dom";
import {
  getDiscountedPrice,
  getDiscountPercentage,
  isDiscountActive,
} from "@/lib/discount"; // Importa las funciones de descuento

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false); // Nuevo estado para indicar si la búsqueda está en curso
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
    const debounceTimer = setTimeout(async () => {
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
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]); // Este efecto se ejecuta cada vez que 'searchTerm' cambia

  return (
    <>
      <div className="py-5 px-7 flex gap-10 items-center border-b border-cocoa bg-cream text-choco dark:border-cream/70 dark:bg-fondo-dark/60 dark:text-gray-100">
        {/* Ya no es un <form> ya que la búsqueda se dispara en onChange */}
        <div className="flex gap-3 items-center flex-1 shadow-lg bg-cocoa/50 dark:bg-fondo-dark rounded-full px-4 py-1.5 dark:text-cream">
          <HiOutlineSearch size={22} />
          <input
            type="text"
            placeholder="¿Qué busca?"
            className="outline-none w-full text-sm bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // El cambio de estado aquí dispara el useEffect
          />
        </div>
        <button
          className="bg-amber-600 text-cream dark:bg-amber-500 dark:text-oscuro hover:bg-amber-700 dark:hover:bg-amber-600 font-medium rounded-full shadow-lg cursor-pointer"
          onClick={closeSheet}
        >
          <IoMdClose size={25} className="p-1" />
        </button>
      </div>

      {/* RESULTADOS DE Busqueda */}
      <div className="p-5 pb-24 h-full bg-fondo/90 text-choco dark:bg-fondo-dark/90 dark:text-cream overflow-y-auto">
        {isSearching && searchTerm.trim() !== "" ? (
          <div className="text-center py-10">
            <p>Buscando productos...</p> {/* Indicador de carga */}
          </div>
        ) : searchResults.length > 0 ? (
          <ul>
            {searchResults.map((product) => {
              // Lógica de descuento para CADA PRODUCTO
              const activeDiscount =
                product.discount && isDiscountActive(product.discount)
                  ? product.discount
                  : null;
              const hasDiscount = !!activeDiscount;
              const discountedPrice =
                hasDiscount && product.price !== undefined
                  ? getDiscountedPrice(product.price, activeDiscount!)
                  : product.price;

              return (
                <li
                  className="p-2 rounded-lg group bg-fondo dark:bg-cocoa/10 hover:bg-cream dark:hover:bg-cocoa/20 mb-2"
                  key={product.id}
                >
                  <button
                    className="flex items-center gap-4 w-full text-left"
                    onClick={() => {
                      navigate(`/products/${product.slug}`);
                      closeSheet();
                    }}
                  >
                    <img
                      src={product.image_url[0]}
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex flex-col gap-1 flex-grow min-w-0">
                      <p className="text-sm font-semibold group-hover:underline">
                        {product.name}
                      </p>

                      <p className="text-[13px] text-gray-600 dark:text-gray-400 truncate">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {hasDiscount ? (
                            <>
                              <p className="text-sm font-medium line-through text-gray-500 dark:text-gray-400">
                                {formatPrice(product.price)}
                              </p>
                              <p className="text-base font-bold text-amber-600 dark:text-amber-500">
                                {formatPrice(discountedPrice)}
                              </p>
                              <span className="text-[10px] bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                                -
                                {getDiscountPercentage(
                                  product.price,
                                  activeDiscount!
                                )}
                                %
                              </span>
                            </>
                          ) : (
                            <p className="text-sm font-medium">
                              {formatPrice(product.price)}
                            </p>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex justify-between gap-1">
                          {product.stock && product.stock > 0 ? (
                            `Stock: ${product.stock}`
                          ) : (
                            <span className="text-red-500">Agotado</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : searchTerm.trim() !== "" && !isSearching ? ( // Mostrar "No se encontraron resultados" solo si se buscó algo y no hay resultados
          <div className="flex flex-col items-center justify-center h-full gap-7">
            <img
              src="/img/misc/NoResult.avif"
              alt="No se encontraron resultados"
              className="w-1/2 border border-cocoa/70 shadow-lg rounded-full p-4 dark:shadow-gray-200 shadow-choco"
            />
            <p className="text-sm text-center">No se encontraron resultados</p>
          </div>
        ) : (
          // Mensaje inicial cuando el campo de búsqueda está vacío
          <div className="flex flex-col items-center justify-center h-full gap-7">
            <HiOutlineSearch size={40} className="text-gray-400" />
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Empieza a escribir para buscar productos...
            </p>
          </div>
        )}
      </div>
    </>
  );
};

// import { useState } from "react";
// import { HiOutlineSearch } from "react-icons/hi";
// import { IoMdClose } from "react-icons/io";
// import { useGlobalStore } from "@/store/global.store";
// import { formatPrice } from "@/helpers";
// import { searchProducts } from "@/actions";
// import { Product } from "@/interfaces";
// import { useNavigate } from "react-router-dom";
// import { getDiscountedPrice, getDiscountPercentage, isDiscountActive } from "@/lib/discount";

// export const Search = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState<Product[]>([]);
//   const closeSheet = useGlobalStore((state) => state.closeSheet);
//   const navigate = useNavigate();

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (searchTerm.trim()) {
//       const products = await searchProducts(searchTerm);
//       setSearchResults(products);
//     } else {
//       setSearchResults([]);
//     }
//   };

//   return (
//     <>
//       <div className="py-5 px-7 flex gap-10 items-center border-b border-cocoa bg-cream text-choco dark:border-cream/70 dark:bg-fondo-dark/60 dark:text-gray-100">
//         <form
//           className="flex gap-3 items-center flex-1 shadow-lg bg-cocoa/50 dark:bg-fondo-dark rounded-full px-4 py-1.5 dark:text-cream"
//           onSubmit={handleSearch}
//         >
//           <HiOutlineSearch size={22} />
//           <input
//             type="text"
//             placeholder="¿Qué busca?"
//             className="outline-none w-full text-sm bg-transparent" // Añadido bg-transparent
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </form>
//         <button
//           className="bg-amber-600 text-cream dark:bg-amber-500 dark:text-oscuro hover:bg-amber-700 dark:hover:bg-amber-600 font-medium rounded-full shadow-lg cursor-pointer"
//           onClick={closeSheet}
//         >
//           <IoMdClose size={25} className="p-1" />
//         </button>
//       </div>

//       {/* RESULTADOS DE Busqueda */}
//       <div className="p-5 pb-12 h-full bg-fondo/90 text-choco dark:bg-fondo-dark/90 dark:text-cream overflow-y-auto">
//         {searchResults.length > 0 ? (
//           <ul>
//             {searchResults.map((product) => {
//               // Lógica de descuento para CADA PRODUCTO
//               const activeDiscount =
//                 product.discount && isDiscountActive(product.discount)
//                   ? product.discount
//                   : null;
//               const hasDiscount = !!activeDiscount;
//               const discountedPrice =
//                 hasDiscount && product.price !== undefined
//                   ? getDiscountedPrice(product.price, activeDiscount!)
//                   : product.price;

//               return (
//                 <li
//                   className="p-2 rounded-lg group bg-fondo dark:bg-cocoa/10 hover:bg-cream dark:hover:bg-cocoa/20 mb-2"
//                   key={product.id}
//                 >
//                   <button
//                     className="flex items-center gap-4 w-full text-left" // Añadido w-full y text-left
//                     onClick={() => {
//                       navigate(`/products/${product.slug}`);
//                       closeSheet();
//                     }}
//                   >
//                     <img
//                       src={product.image_url[0]}
//                       alt={product.name}
//                       className="h-16 w-16 object-cover rounded-lg flex-shrink-0" // Añadido flex-shrink-0
//                     />

//                     <div className="flex flex-col gap-1 flex-grow min-w-0">
//                       {" "}
//                       {/* Añadido flex-grow */}
//                       <p className="text-sm font-semibold group-hover:underline">
//                         {product.name}
//                       </p>
//                       <p className="text-[13px] text-gray-600 dark:text-gray-400 truncate">
//                         {product.description}
//                       </p>
//                       <div className="flex items-center justify-between gap-2">
//                         <div className="flex items-center gap-2">
//                           {" "}
//                           {hasDiscount ? (
//                             <>
//                               <p className="text-sm font-medium line-through text-gray-500 dark:text-gray-400">
//                                 {formatPrice(product.price)}
//                               </p>
//                               <p className="text-sm font-bold text-amber-600 dark:text-amber-500">
//                                 {formatPrice(discountedPrice)}
//                               </p>
//                               <span className="text-[10px] bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
//                                 -
//                                 {getDiscountPercentage(
//                                   product.price,
//                                   activeDiscount
//                                 )}
//                                 %
//                               </span>
//                             </>
//                           ) : (
//                             <p className="text-sm font-medium">
//                               {formatPrice(product.price)}
//                             </p>
//                           )}
//                         </div>
//                         <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex justify-between gap-1">
//                           {product.stock && product.stock > 0 ? (
//                             `Stock: ${product.stock}`
//                           ) : (
//                             <span className="text-red-500">Agotado</span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-full gap-7">
//             <img
//               src="/img/misc/NoResult.avif"
//               alt="No se encontraron resultados"
//               className="w-1/2 border border-cocoa/70 shadow-lg rounded-full p-4 dark:shadow-gray-200 shadow-choco"
//             />
//             <p className="text-sm text-center">No se encontraron resultados</p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };
