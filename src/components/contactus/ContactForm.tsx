import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Send,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { ContactFormData } from "@components/contactus/types";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const inputClass = `w-full px-4 py-3 text-sm rounded-xl border transition-all duration-200
  bg-fondo dark:bg-fondo-dark text-choco dark:text-cream
  placeholder:text-choco/40 dark:placeholder:text-cream/40
  border-cocoa/30 dark:border-cream/20
  focus:outline-none focus:ring-2 focus:ring-choco/20 dark:focus:ring-cream/20
  focus:border-choco dark:focus:border-cream/60`;

const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-choco/60 dark:text-cream/60 mb-1.5";

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const templateParams = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    subject: formData.subject,
    message: formData.message,
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess)
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-choco dark:text-cream">
          ¡Mensaje enviado!
        </h3>
        <p className="text-sm text-choco/60 dark:text-cream/60 max-w-xs">
          Gracias por contactarnos. Te responderemos a la brevedad posible.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="btn-primary px-6 py-2.5 rounded-full text-sm mt-2"
        >
          Enviar otro mensaje
        </button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4.5 gap-x-5">
        <div>
          <label className={labelClass}>
            <User className="size-3 inline mr-1" />
            Nombre completo *
          </label>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Tu nombre"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            <Mail className="size-3 inline mr-1" />
            Correo electrónico *
          </label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="tu@correo.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            <Phone className="size-3 inline mr-1" />
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0414-1234567"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            <MessageSquare className="size-3 inline mr-1" />
            Asunto *
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Selecciona un asunto</option>
            <option value="Consulta sobre un producto">
              Consulta sobre un producto
            </option>
            <option value="Pedido especial">Pedido especial</option>
            <option value="Pregunta sobre un pedido">
              Pregunta sobre un pedido
            </option>
            <option value="Devoluciones">Devoluciones</option>
            <option value="Soporte técnico">Soporte técnico</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Mensaje *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Cuéntanos en qué podemos ayudarte..."
          className={`${inputClass} resize-none w-full h-full block min-h-[120px] sm:min-h-[240px]`}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm bg-choco text-cream dark:bg-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        <Send className="size-4" />
        {isLoading ? "Enviando..." : "Enviar Mensaje"}
      </button>
    </form>
  );
};
