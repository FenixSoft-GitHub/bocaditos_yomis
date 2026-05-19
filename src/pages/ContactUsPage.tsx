import { Mylocation } from "@/components/contactus";
import { ContactForm } from "@/components/contactus";
import { ContactInfo } from "@/components/contactus";
import { FAQSection } from "@/components/contactus";
import { SocialLinks } from "@/components/contactus";
import { SEOHead } from "@/components/seo/SEOHead";
import { breadcrumbSchema } from "@/components/seo/schemas";
import { FadeIn } from "@/components/animations";

const ContactUsPage = () => (
  <>
    <SEOHead
      title="Contáctanos"
      description="¿Tienes alguna pregunta o pedido especial? Contáctanos y te responderemos a la brevedad."
      canonical="/contact-us"
      schema={breadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Contáctanos", url: "/contact-us" },
      ])}
    />

    <div className="w-full text-choco dark:text-cream">
      {/* ── Hero ──────────────────────────────────────────────────── */}
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

        <div className="relative max-w-[680px] text-cream flex flex-col gap-5 text-end py-20 px-4 lg:py-40 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-cream/70">
            Bocaditos Yomi's · Contacto
          </p>
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] leading-tight">
            Estamos aquí para ayudarte
          </h1>
          <p className="text-sm md:text-lg text-cream/90 leading-relaxed">
            ¿Tienes una pregunta, un pedido especial o simplemente quieres
            saludar? Escríbenos y te responderemos a la brevedad.
          </p>
        </div>
      </div>

      {/* ── Formulario + Info — layout 2 columnas en desktop ──────── */}
      <FadeIn>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* Formulario — columna más ancha */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-cocoa mb-1">
                  Escríbenos
                </p>
                <h2 className="text-2xl font-bold">Envíanos un mensaje</h2>
                <p className="text-sm text-choco/60 dark:text-cream/60 mt-1">
                  Completa el formulario y nos pondremos en contacto contigo.
                </p>
              </div>
              <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-2xl p-6 shadow-sm">
                <ContactForm />
              </div>
            </div>

            {/* Info + Redes */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <ContactInfo />
              <div className="border-t border-cocoa/10 dark:border-cream/10 pt-6">
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <FadeIn>
        <div className="bg-cocoa/5 dark:bg-cream/5 border-y border-cocoa/10 dark:border-cream/10 py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <FAQSection />
          </div>
        </div>
      </FadeIn>

      {/* ── Ubicación ─────────────────────────────────────────────── */}
      <FadeIn>
        <div id="location" className="py-16">
          <div className="container mx-auto px-4 mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-cocoa mb-1">
              Encuéntranos
            </p>
            <h2 className="text-2xl font-bold">Nuestra ubicación</h2>
            <p className="text-sm text-choco/60 dark:text-cream/60 mt-1">
              Visítanos en nuestra tienda física
            </p>
          </div>
          <Mylocation />
        </div>
      </FadeIn>
    </div>
  </>
);

export default ContactUsPage;