interface Props {
  numberOfProducts: number;
}

export const ProductGridSkeleton = ({ numberOfProducts }: Props) => {
  return (
    <div className="my-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8">
        {Array.from({ length: numberOfProducts }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <div className="relative aspect-square bg-gray-200 rounded-lg animate-pulse" />
            
            <div className="flex flex-col gap-2">
              {/* Título */}
              <div className="h-[2.5rem] bg-gray-200 rounded animate-pulse" />
              
              {/* Precio y variantes */}
              <div className="flex items-center gap-2">
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              
              {/* Colores */}
              <div className="flex gap-1.5">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                ))}
              </div>
              
              {/* Botón */}
              <div className="w-full h-10 mt-2 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
