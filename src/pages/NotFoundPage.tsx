import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { useGlobalStore } from "@/store/global.store";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const openSheet = useGlobalStore((state) => state.openSheet);

  return (
    <>
      <SEOHead
        title="Página no encontrada"
        description="Lo sentimos, esta página no existe."
        noIndex
      />

      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
        {/* Imagen animada */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <img
            src="/img/misc/NoResult.png"
            alt="Página no encontrada"
            className="w-56 md:w-58 drop-shadow-xl rounded-2xl"
          />
        </motion.div>

        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center space-y-3 max-w-md"
        >
          <p className="text-6xl font-black text-cocoa dark:text-cocoa tracking-tight">
            404
          </p>
          <h1 className="text-2xl font-bold">¡Ups! Esta página no existe</h1>
          <p className="text-sm text-choco/60 dark:text-cream/60 leading-relaxed">
            Parece que el bocadito que buscas ya no está disponible o la
            dirección tiene un error. No te preocupes, tenemos muchas otras
            delicias esperándote.
          </p>
        </motion.div>

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 mt-10"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-cocoa/40 dark:border-cream/20 text-sm font-medium text-choco dark:text-cream hover:bg-choco/10 dark:hover:bg-cream/10 transition-all duration-200"
          >
            <ArrowLeft className="size-4" />
            Volver atrás
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-choco text-cream dark:bg-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Home className="size-4" />
            Ir al Inicio
          </Link>

          <button
            onClick={() => openSheet("search")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-cocoa/40 dark:border-cream/20 text-sm font-medium text-choco dark:text-cream hover:bg-choco/10 dark:hover:bg-cream/10 transition-all duration-200"
          >
            <Search className="size-4" />
            Buscar productos
          </button>
        </motion.div>

        {/* Links rápidos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {[
            { to: "/products", label: "Productos" },
            { to: "/about", label: "Sobre Nosotros" },
            { to: "/blog", label: "Blog" },
            { to: "/contact-us", label: "Contáctanos" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-xs text-choco/50 dark:text-cream/50 hover:text-choco dark:hover:text-cream underline underline-offset-4 transition-colors"
            >
              {label}
            </Link>
          ))}
        </motion.div>
      </main>
    </>
  );
};

export default NotFoundPage;
