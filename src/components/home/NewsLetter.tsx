import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

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
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          email,
          subject: "Nueva suscripción al boletín",
          message: `Nuevo suscriptor: ${email}`,
        },
        PUBLIC_KEY,
      );
      setIsSuccess(true);
      setEmail("");
    } catch {
      setError("Error al suscribirse. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="relative py-20 overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      <img
        src="/img/banner/imgNew.avif"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-oscuro/60" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-md bg-fondo dark:bg-fondo-dark border border-cocoa/30 dark:border-cream/20 rounded-2xl p-8 space-y-5 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-choco dark:text-cocoa" />
              <p className="text-xs uppercase font-semibold tracking-widest text-choco/60 dark:text-cream/60">
                Boletín exclusivo
              </p>
            </div>
            <h2
              id="newsletter-heading"
              className="text-xl font-bold text-choco dark:text-cream"
            >
              Recibe promociones y novedades
            </h2>
            <p className="text-sm text-choco/60 dark:text-cream/60 leading-relaxed">
              Sé el primero en enterarte de nuestros nuevos productos y ofertas
              especiales.
            </p>
          </div>

          {isSuccess ? (
            <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <CheckCircle className="size-5 text-green-600 dark:text-green-400 shrink-0" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                ¡Gracias por suscribirte! Pronto recibirás novedades.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
                aria-label="Correo para suscripción"
                className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-cocoa/30 dark:border-cream/20 bg-cream dark:bg-fondo-dark text-choco dark:text-cream placeholder:text-choco/40 dark:placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-choco/20 dark:focus:ring-cream/20"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary px-5 py-2.5 rounded-lg shrink-0 disabled:opacity-50"
              >
                {isLoading ? "Enviando..." : "Suscribirme"}
              </button>
            </form>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
              <AlertCircle className="size-4 shrink-0" />
              <p className="text-xs">{error}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
