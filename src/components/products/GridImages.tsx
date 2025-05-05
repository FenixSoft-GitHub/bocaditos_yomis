import { useState } from "react";

interface Props {
  images: string[];
}

const GridImages = ({ images }: Props) => {
  const [activeImage, setActiveImage] = useState(images[0]);

  const handleImageClick = (image: string) => {
    setActiveImage(image);
  };

  return (
    <div className="flex flex-col md:flex-row relative gap-4">
      {/* Imagen principal: se muestra primero en desktop, segundo en móvil */}
      <div className="order-1 md:order-2 bg-cocoa/20 lg:w-[550px] lg:h-[500px] max-w-[550px] max-h-[500px] mx-auto flex items-center justify-center p-4 rounded-lg dark:bg-cream/10">
        <img
          src={activeImage}
          alt="Vista principal del producto"
          className="h-full w-auto max-w-full object-contain rounded-lg transition-all duration-300 ease-in-out"
        />
      </div>

      {/* Miniaturas: se muestran después en desktop, primero en móvil */}
      <div className="order-2 md:order-1 flex md:flex-col gap-2">
        {images.map((image) => {
          const isActive = activeImage === image;
          return (
            <button
              key={image}
              onClick={() => handleImageClick(image)}
              aria-pressed={isActive}
              role="tab"
              className={`w-16 h-16 border ${
                isActive ? "border-cocoa/70" : "border-transparent"
              } rounded-lg hover:border-oscuro hover:dark:border-cream/80 focus:outline-none transition-all cursor-pointer`}
            >
              <img
                src={image}
                alt="Miniatura del producto"
                className="w-full h-full object-cover rounded-lg aspect-square"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GridImages;

// import { useState } from "react"

// interface Props {
//   images: string[]
// }

// const GridImages = ({ images }: Props) => {
//   const [activeImage, setActiveImage] = useState(images[0])

//   const handleImageClick = (image: string) => {
//     setActiveImage(image)
//   }

//   return (
//     <div className="flex flex-1 flex-col md:flex-row relative gap-2">
//       <div className="flex justify-center gap-2">
//         {images.map((image, index) => (
//           <button
//             key={image}
//             onClick={() => handleImageClick(image)}
//             className={`w-16 h-16 border ${
//               activeImage === image ? "border-cocoa/70" : "border-transparent"
//             } rounded-lg hover:border-oscuro hover:dark:border-cream/80 focus:outline-none`}
//           >
//             <img
//               src={image}
//               alt={`Thumbnail ${index + 1}`}
//               className="w-full h-full rounded-lg object-cover"
//             />
//           </button>
//         ))}
//       </div>

//       <div className="bg-gray-200 lg:w-[550px] lg:h-[500px] max-w-[550px] max-h-[500px] mx-auto flex items-center justify-center p-4 rounded-lg dark:bg-cream/10">
//         <img
//           src={activeImage}
//           alt="Imagen del producto"
//           className="h-full w-auto max-w-full object-contain rounded-lg"
//         />
//       </div>
//     </div>
//   );
// }

// export default GridImages
