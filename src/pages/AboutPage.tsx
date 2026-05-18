import { Link } from "react-router-dom";
import BentoItem from "@/components/about/BentoItem";
import { BentoAbout } from "@/constants/BentoAbout";
import Numeros from "@/components/about/Numeros";
import { ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { breadcrumbSchema } from "@/components/seo/schemas";
import { FadeIn } from "@/components/animations";
import { Sections } from "@/components/about/Sections";

const AboutPage = () => {
  return (
    <>
      <SEOHead
        title="Sobre Nosotros"
        description="Conoce la historia de Bocaditos Yomi's, nuestra pasión por los snacks artesanales y el equipo detrás de cada bocadito."
        canonical="/about"
        schema={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Sobre Nosotros", url: "/about" },
        ])}
      />

      <div className="w-full text-choco dark:text-cream">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="relative w-full h-screen flex justify-end items-center">
          <img
            src="/img/about/about.avif"
            alt="Sobre Bocaditos Yomi's"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-fondo dark:from-fondo-dark to-transparent" />

          <div className="relative max-w-[700px] flex flex-col text-end px-4 lg:px-12 gap-4 text-cream">
            <p className="text-xs font-semibold uppercase tracking-widest text-cream/70">
              Bocaditos Yomi's · Nuestra historia
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              Donde el sabor tiene alma
            </h1>
            <p className="text-sm md:text-lg text-cream/90 leading-relaxed">
              En Bocaditos Yomi's creemos que cada dulce tiene una historia. La
              nuestra comenzó en una cocina familiar, entre risas, recetas
              heredadas y el amor por compartir algo hecho con las manos y el
              corazón.
            </p>
          </div>
        </div>

        {/* ── Secciones Historia / Misión / Visión ──────────────────── */}
        <div className="container mx-auto px-4 py-16 flex flex-col gap-20">
          {Sections.map(
            ({
              id,
              title,
              text,
              image,
              imageAlt,
              reverse,
              link,
              scenery,
              sceneryText,
              icon: Icon,
            }) => (
              <FadeIn key={id}>
                <div
                  className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 lg:gap-16`}
                >
                  {/* Imagen */}
                  <div id={scenery} className="w-full md:w-1/2">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video">
                      <img
                        src={image}
                        alt={imageAlt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </div>

                  {/* Texto */}
                  <div
                    id={sceneryText}
                    className="w-full md:w-1/2 flex flex-col gap-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-cocoa/15 dark:bg-cream/15 flex items-center justify-center shrink-0">
                        <Icon className="size-5 text-choco/70 dark:text-cream/70" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-cocoa">
                        {title}
                      </p>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold leading-snug">
                      {title}
                    </h2>
                    <p className="text-sm md:text-base leading-relaxed text-choco/80 dark:text-cream/80">
                      {text}
                    </p>
                    {link && (
                      <Link
                        to={link.to}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-choco dark:text-cream hover:text-cocoa dark:hover:text-cocoa transition-colors group w-fit"
                      >
                        {link.label}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </FadeIn>
            ),
          )}
        </div>

        {/* ── Valores ───────────────────────────────────────────────── */}
        <FadeIn>
          <div className="bg-cocoa/5 dark:bg-cream/5 border-y border-cocoa/10 dark:border-cream/10 py-12 mt-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10 max-w-2xl mx-auto">
                <p className="text-xs font-semibold uppercase tracking-widest text-cocoa mb-2">
                  Lo que nos define
                </p>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Nuestros Valores
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-choco/70 dark:text-cream/70">
                  En Bocaditos Yomi's, cada dulce que horneamos está lleno de
                  intención. Nuestros valores son el alma de nuestra marca, y
                  guían cada paso que damos, desde la selección de ingredientes
                  hasta la sonrisa del cliente al recibir su pedido.
                </p>
              </div>

              {/* Bento Grid de valores */}
              <div className="w-full max-w-[1400px] grid lg:grid-cols-10 auto-rows-[22rem] gap-5 mx-auto">
                {BentoAbout.map((item, index) => (
                  <BentoItem
                    key={index}
                    title={item.title}
                    description={item.description}
                    url={item.url}
                    classCol={item.classCol}
                    classMax={item.classMax}
                  />
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Números ───────────────────────────────────────────────── */}
        <FadeIn>
          <Numeros />
        </FadeIn>
      </div>
    </>
  );
};

export default AboutPage;
