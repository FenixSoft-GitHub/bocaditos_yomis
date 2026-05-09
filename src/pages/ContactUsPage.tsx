import { Mylocation } from "@/components/contactus";
import { ContactForm } from "@/components/contactus";
import { ContactInfo } from "@/components/contactus";
import { FAQSection } from "@/components/contactus";
import { SocialLinks } from "@/components/contactus";
import { SEOHead } from "@/components/seo/SEOHead";
import { breadcrumbSchema } from "@/components/seo/schemas";

const ContactUsPage = () => {
  return (
    <>
      <SEOHead
        title="Contáctanos"
        description="¿Tienes preguntas? Contáctanos y te responderemos a la brevedad."
        canonical="/contact-us"
        schema={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Contáctanos", url: "/contact-us" },
        ])}
      />
      <div className="w-full h-full">
        {/* Hero Section */}
        <div className="relative w-full h-screen flex justify-end items-center">
          <img
            src="/img/contactus/contactanos.avif"
            alt="Contáctanos — Bocaditos Yomi's"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-fondo dark:from-fondo-dark to-transparent" />
          <div className="relative max-w-[700px] text-cream flex flex-col gap-6 text-end py-20 px-4 lg:py-40 lg:px-8">
            <h1 className="text-5xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
              Contáctanos
            </h1>
            <p className="mx-auto text-balance text-end text-sm tracking-wide md:text-xl">
              ¿Tienes alguna pregunta, necesitas asistencia o simplemente
              quieres saber más sobre nuestros productos? En Bocaditos Yomi's,
              estamos aquí para ayudarte. Utiliza el formulario a continuación
              para enviarnos un mensaje directo, o consulta nuestra información
              de contacto para comunicarte con nosotros por correo electrónico o
              teléfono. Tu satisfacción es nuestra prioridad, y nos esforzaremos
              por responder a tu consulta lo antes posible.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-18">
            <div>
              <ContactForm />
            </div>
            <div>
              <ContactInfo />
            </div>
          </div>
          <div>
            <SocialLinks />
          </div>
          <div id="location">
            <Mylocation />
          </div>
          <div id="faq" className="container mx-auto mb-10 max-w-[800px]">
            <FAQSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsPage;
