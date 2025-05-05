import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const templateParams = {
      email,
      subject: "Nueva suscripción al boletín",
      message: `Nuevo usuario suscrito al boletín: ${email}`,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Error al suscribirse. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-gray-500 text-cream py-20">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 bg-cover bg-center  h-full bg-[url('/img/banner/imgNew.avif')]" />

      {/* Contenido del Newsletter */}
      <div className="container mx-auto z-10 relative">
        <div className="w-full text-black bg-cream p-8 space-y-5 md:w-[50%] lg:w-[40%] rounded-md dark:bg-fondo-dark dark:text-gray-100 dark:border-gray-500 dark:border">
          <p className="text-xs uppercase font-semibold">
            Suscríbete a nuestro boletín y recibe promociones exclusivas
          </p>
          <p className="text-xs font-medium w-[80%] leading-4">
            Introduce tu correo para recibir ofertas
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 xl:flex-row">
            <input
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border border-choco/70 focus:outline-none rounded-md py-2 px-4 w-full text-xs font-medium"
              placeholder="Correo Electrónico"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-choco text-cream font-semibold rounded-full uppercase tracking-wider py-3 text-xs xl:px-5 transition duration-300 ease-in-out hover:scale-105 shadow-lg dark:text-cream"
            >
              {isLoading ? "Enviando..." : "Suscribirme"}
            </button>
          </form>

          {isSuccess && <p className="text-green-500 text-xs">¡Gracias por suscribirte!</p>}
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;




// const NewsLetter = () => {
//     return (
//         <div className="relative bg-gray-500 text-cream py-20">
//           {/* IMAGEN DE FONDO */}
//           <div
//             className="absolute inset-0 bg-cover bg-center opacity-70 h-full bg-[url('/img/img3.webp')]"
//           />
    
//           {/* CONTENIDO DE NEWSLETTER */}
//           <div className="container mx-auto z-10 relative">
//             <div className="w-full text-black bg-white p-8 space-y-5 md:w-[50%] lg:w-[40%] rounded-md dark:bg-gray-900 dark:text-gray-100 dark:border-gray-500 dark:border">
//               <p className="text-xs uppercase font-semibold">
//                 Suscríbete a nuestro boletín y recibe promociones exclusivas
//               </p>
//               <p className="text-xs font-medium w-[80%] leading-4">
//                 Introduce tu correo para recibir ofertas
//               </p>
//               <form className="flex flex-col gap-5 xl:flex-row">
//                 <input
//                   type="email"
//                   className="border border-slate-500 focus:outline-none rounded-md py-2 px-4 w-full text-xs font-medium"
//                   placeholder="Correo Electrónico"
//                 />
    
//                 <button 
//                   className="bg-black text-white font-semibold rounded-full uppercase tracking-wider py-3 text-xs xl:px-5 transition duration-300 ease-in-out hover:scale-105 shadow-lg dark:bg-gray-700 dark:text-gray-100"
//                 >
//                   Suscribirme
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       )
// }

// export default NewsLetter