import { useState } from "react";

interface Props {
  images: string[];
}

const GridImages = ({ images }: Props) => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleImageClick = (image: string) => {
    setActiveImage(image);
  };

  const handleMouseEnter = (image: string) => {
    setZoomImage(image);
    setShowZoom(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
    setZoomImage(null);
  };

  return (
    <div className="flex flex-col md:flex-row relative gap-4">
      {/* Imagen principal */}
      <div className="order-1 md:order-2 bg-cocoa/20 lg:w-[550px] lg:h-[500px] max-w-[550px] max-h-[500px] mx-auto flex items-center justify-center p-4 rounded-lg dark:bg-cream/10">
        <img
          src={activeImage}
          alt="Vista principal del producto"
          className="h-full w-auto max-w-full object-contain rounded-lg transition-all duration-300 ease-in-out"
        />
      </div>

      {/* Miniaturas */}
      <div className="order-2 md:order-1 flex md:flex-col gap-2 relative">
        {images.map((image) => {
          const isActive = activeImage === image;
          return (
            <button
              key={image}
              onClick={() => handleImageClick(image)}
              onMouseEnter={() => handleMouseEnter(image)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`w-16 h-16 border ${
                isActive ? "border-cocoa/70" : "border-transparent"
              } rounded-lg hover:border-oscuro hover:dark:border-cream/80 focus:outline-none transition-all cursor-pointer relative`}
            >
              <img
                src={image}
                alt="Miniatura del producto"
                className="w-full h-full object-cover rounded-lg aspect-square"
              />

              {/* Zoom flotante */}
              {showZoom && zoomImage === image && (
                <div
                  className="absolute z-50 border border-gray-300 shadow-lg rounded-lg pointer-events-none overflow-hidden"
                  style={{
                    top: zoomPosition.y + 20,
                    left: zoomPosition.x + 20,
                    width: 250,
                    height: 250,
                    background: `url(${zoomImage}) no-repeat center`,
                    backgroundSize: "cover",
                  }}
                ></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GridImages;