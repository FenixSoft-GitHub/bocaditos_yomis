const Maps_EMBED_URL = import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL;

export const Mylocation = () => {
  if (!Maps_EMBED_URL) {
    return (
      <div className="text-center text-red-500 my-4">
        No se pudo cargar el mapa. Verifique la configuración del entorno.
      </div>
    );
  }

  return (
    <div>
      <div className="container px-4 justify-center max-w-[800px] mx-auto my-8 text-choco dark:text-cream">
        <h2 className="text-3xl font-bold text-center mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
          Nuestra Ubicación
        </h2>
        <div className="relative w-full h-0 pb-[56.25%]">
          {" "}
          {/* 16:9 ratio */}
          <iframe
            src={Maps_EMBED_URL}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de ubicación de Bocaditos Yomi's"
          />
        </div>
      </div>
    </div>
  );
};
