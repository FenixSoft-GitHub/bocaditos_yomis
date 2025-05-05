import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { FiSend } from "react-icons/fi";
import { ContactFormData } from "@components/contactus/types";
import SuccessMessage from "@components/contactus/SuccessMessage";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

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
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const templateParams = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    subject: formData.subject,
    message: formData.message,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const handleCloseSuccessMessage = () => {
    setIsSuccess(false);
};

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-6 text-choco dark:text-cream bg-cream dark:bg-fondo-dark px-8 py-6 rounded-2xl shadow-lg dark:border dark:border-choco/50"
    >
      <h2 className="text-2xl font-bold mb-2 text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
        Contáctanos
      </h2>
      <p className="text-sm text-center">
        Llena el siguiente formulario y te responderemos lo antes posible.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium ">
            Nombre completo
          </label>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mt-1 border text-sm border-cocoa/50 rounded-lg shadow-sm dark:border-cream/30 p-3 focus:border-choco dark:focus:border-cream focus:outline-none transition-colors focus:ring-1 duration-300"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mt-1 border text-sm border-cocoa/50 rounded-lg shadow-sm dark:border-cream/30 p-3 focus:border-choco dark:focus:border-cream focus:outline-none transition-colors focus:ring-1 duration-300"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mt-1 border text-sm border-cocoa/50 rounded-lg shadow-sm dark:border-cream/30 p-3 focus:border-choco dark:focus:border-cream focus:outline-none transition-colors focus:ring-1 duration-300"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium">
            Asunto
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full mt-1 border text-sm border-cocoa/50 rounded-lg shadow-sm dark:border-cream/30 p-3 focus:border-choco dark:focus:border-cream focus:outline-none transition-colors focus:ring-1 duration-300"
          >
            <option value="">Selecciona un asunto</option>
            <option value="Consulta sobre un producto">
              Consulta sobre un producto
            </option>
            <option value="Soporte técnico">Soporte técnico</option>
            <option value="Pregunta sobre un pedido">
              Pregunta sobre un pedido
            </option>
            <option value="Devoluciones">Devoluciones</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Mensaje
        </label>
        <textarea
          name="message"
          id="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          required
          className="w-full mt-1 border text-sm border-cocoa/50 rounded-lg shadow-sm dark:border-cream/30 p-3 focus:border-choco dark:focus:border-cream focus:outline-none transition-colors focus:ring-1 duration-300"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center items-center gap-2 mb-4 py-3 px-6 rounded-xl text-cream font-medium transition-all duration-200 cursor-pointer ${
          isLoading
            ? "bg-oscuro cursor-wait"
            : "bg-amber-600 text-white dark:bg-amber-500 dark:text-black hover:bg-amber-700 dark:hover:bg-amber-600 focus:ring-2 focus:ring-amber-400"
        }`}
      >
        <FiSend className="text-lg" />
        {isLoading ? "Enviando..." : "Enviar Mensaje"}
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {isSuccess && <SuccessMessage onClose={handleCloseSuccessMessage} />}
    </form>
  );
};