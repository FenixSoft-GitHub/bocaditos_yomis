import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useGlobalStore } from "@/store/global.store";
import { formatPrice } from "@/helpers";
import { searchProducts } from "@/actions";
import { Product } from "@/interfaces";
import { useNavigate } from "react-router-dom";

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const closeSheet = useGlobalStore((state) => state.closeSheet);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      const products = await searchProducts(searchTerm);
      setSearchResults(products);
    }
  };

  return (
    <>
      <div className="py-5 px-7 flex gap-10 items-center border-b border-cocoa bg-cream text-choco dark:border-cream/70 dark:bg-fondo-dark/60 dark:text-gray-100">
        <form
          className="flex gap-3 items-center flex-1 shadow-lg bg-cocoa/50 dark:bg-fondo-dark rounded-full px-4 py-1.5 dark:text-cream"
          onSubmit={handleSearch}
        >
          <HiOutlineSearch size={22} />
          <input
            type="text"
            placeholder="¿Qué busca?"
            className="outline-none w-full text-sm "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <button
          className="bg-amber-600 text-cream dark:bg-amber-500 dark:text-oscuro hover:bg-amber-700 dark:hover:bg-amber-600 font-medium  rounded-full shadow-lg cursor-pointer"
          onClick={closeSheet}
        >
          <IoMdClose size={25} className="p-1" />
        </button>
      </div>

      {/* RESULTADOS DE Busqueda */}
      <div className="p-5 h-full bg-fondo/90 text-choco dark:bg-fondo-dark/90 dark:text-cream overflow-y-auto">
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((product) => (
              <li
                className="p-2 rounded-lg group bg-fondo dark:bg-cocoa/10 hover:bg-cream dark:hover:bg-cocoa/20 mb-2"
                key={product.id}
              >
                <button
                  className="flex items-center gap-4"
                  onClick={() => {
                    navigate(`/products/${product.slug}`);
                    closeSheet();
                  }}
                >
                  <img
                    src={product.image_url[0]}
                    alt={product.name}
                    className="h-16 w-16 object-cover rounded-lg"
                  />

                  <div className="flex flex-col gap-1 text-left">
                    <p className="text-sm font-semibold group-hover:underline">
                      {product.name}
                    </p>

                    <p className="text-[13px]">
                      {product.description} /{" "}
                      {product?.stock ?? 0 > 0 ? "En stock" : "Agotado"}
                    </p>

                    <p className="text-sm font-medium">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-7">
            <img
              src="/img/misc/NoResult.avif"
              alt="No se encontraron resultados"
              className="w-1/2 border border-cocoa/70 shadow-lg rounded-full p-4 dark:shadow-gray-200 shadow-choco"
            />
            <p className="text-sm text-center">No se encontraron resultados</p>
          </div>
        )}
      </div>
    </>
  );
};
