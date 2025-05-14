import { Link } from "react-router-dom";
import BentoItem from "@/components/about/BentoItem";
import { BentoAbout } from "@/constants/BentoAbout";
import Numeros from "@/components/about/Numeros";
import { FaArrowRight } from "react-icons/fa6";
const AboutPage = () => {
  return (
    <div className="w-full h-full">
      {/* Hero Section */}
      <div className="relative w-full h-screen flex justify-end items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat h-full bg-[url('/img/about/about.avif')] dark:mask-image-[linear-gradient(to_bottom,_black_80%,_transparent)] light:mask-image-[linear-gradient(to_bottom,_white_80%,_transparent)]"
          style={{
            maskImage: "linear-gradient(to bottom, black 80%, transparent)",
          }}
        />
        <div className="absolute inset-0 bg-black opacity-20" />

        <div className="relative max-w-[750px] flex flex-col text-end px-4 lg:px-12 gap-3.5 text-cream">
          <h2 className="text-4xl font-bold mb-3 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
            Nuestra Razón de Ser
          </h2>
          <h3 className="text-2xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
            Bocaditos Yomi's - Donde el sabor tiene alma
          </h3>
          <div className="text-balance text-end text-sm tracking-wide md:text-xl ">
            <p>
              En <strong>Bocaditos Yomi's</strong> creemos que cada dulce tiene
              una historia, y la nuestra comenzó en una cocina familiar, entre
              risas, recetas heredadas y el amor por compartir algo hecho con
              las manos y el corazón.
            </p>
            <p>
              Somos una{" "}
              <strong>pastelería, panadería y repostería artesanal</strong> que
              nació con el sueño de llevar momentos dulces a la vida de nuestros
              clientes. Desde nuestros primeros pedidos hasta hoy, nos enfocamos
              en ofrecer productos frescos, hechos al momento, con ingredientes
              de calidad y un toque casero que se siente en cada bocado.
            </p>
          </div>
        </div>
      </div>

      <section className="max-w-[1400px] w-full mx-auto gap-4 lg:gap-10 text-pretty p-6 text-left text-xl sm:px-20 flex flex-col md:flex-row items-center justify-between md:p-8 my-1 lg:my-12">
        <div
          id="theater-text"
          className="md:w-1/2 space-y-4 text-choco dark:text-cream"
        >
          <h1 className="mx-auto mb-10 text-balance text-left text-3xl lg:text-5xl font-semibold tracking-wide  drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
            Nuestra Historia
          </h1>
          <p>
            Todo comenzó con una receta de familia, unas ganas inmensas de crear
            momentos felices… y el aroma irresistible de un bizcocho recién
            horneado. Bocaditos Yomi’s nació del amor por lo artesanal, de esas
            manos que amasan con cariño y de sueños que se cocinan lento, pero
            con mucho corazón.
          </p>
          <Link
            to={"/about/nuestra-historia"}
            className="inline-flex items-center gap-2 bg-cocoa/20 px-3 py-1 rounded-md text-sm text-oscuro dark:text-amber-400 dark:hover:text-dorado hover:underline font-medium hover:scale-105 transform-all ease-in-out duration-300"
          >
            Leer más
            <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div id="theater" className="mt-6 md:mt-0 md:w-1/2">
          <img
            className="object-cover w-full h-full rounded-md shadow-lg"
            height={500}
            src="/img/about/historia.avif"
            style={{
              aspectRatio: "812/556",
              objectFit: "cover",
            }}
            width={500}
          />
        </div>
      </section>

      <section className="max-w-[1400px] w-full mx-auto gap-4 lg:gap-10 text-pretty p-6 text-left text-xl sm:px-20 flex flex-col md:flex-row items-center justify-between md:p-8 my-1 lg:my-12">
        <div id="trophies" className="mt-6 md:mt-0 md:w-1/2">
          <img
            className="object-cover w-full h-full rounded-md shadow-lg"
            height={556}
            src="/img/about/mision.avif"
            style={{
              aspectRatio: "812/556",
              objectFit: "cover",
            }}
            width={812}
          />
        </div>
        <div
          id="trophies-text"
          className="md:w-1/2 space-y-4 text-choco dark:text-cream"
        >
          <h1 className="mx-auto mb-10 text-balance text-left text-3xl lg:text-5xl font-semibold tracking-wide  drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
            Nuestra Misión
          </h1>
          <p>
            Brindar experiencias dulces que generen emociones, elaborando
            productos horneados con dedicación, tradición y creatividad, para
            acompañar celebraciones y alegrar los días de quienes confían en
            nosotros.
          </p>
        </div>
      </section>

      <section className="max-w-[1400px] w-full mx-auto gap-4 lg:gap-10 text-pretty p-6 text-left text-xl sm:px-20 flex flex-col md:flex-row items-center justify-between md:p-8 my-1 lg:my-12">
        <div
          id="theater-text"
          className="md:w-1/2 space-y-4 text-choco dark:text-cream"
        >
          <h1 className="mx-auto mb-10 text-balance text-left text-3xl lg:text-5xl font-semibold tracking-wide drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
            Nuestra Visión
          </h1>
          <p>
            Ser la pastelería de referencia en la ciudad, reconocida por nuestro
            compromiso con la calidad, el trato cercano y la innovación en cada
            creación que sale de nuestro horno.
          </p>
        </div>
        <div id="theater" className="mt-6 md:mt-0 md:w-1/2">
          <img
            className="object-cover w-full h-full rounded-md shadow-lg"
            height={500}
            src="/img/about/vision.avif"
            style={{
              aspectRatio: "812/556",
              objectFit: "cover",
            }}
            width={500}
          />
        </div>
      </section>

      <section className="text-xl text-center px-6 lg:px-20 lg:max-w-[70ch] text-pretty mx-auto my-4 mt-10 text-choco dark:text-cream">
        <h1 className="text-3xl lg:text-5xl font-semibold text-wrap mx-auto mb-5 tracking-wide  drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
          Nuestros Valores
        </h1>

        <p>
          En Bocaditos Yomi's, cada dulce que horneamos está lleno de intención.
          Nuestros valores son el alma de nuestra marca, y guían cada paso que
          damos, desde la selección de ingredientes hasta la sonrisa del cliente
          al recibir su pedido. Creemos que la calidad va más allá del sabor: se
          siente en el servicio, en los detalles y en la pasión con la que
          trabajamos cada día.
        </p>
      </section>

      <section className="w-full max-w-[1400px] grid lg:grid-cols-10 auto-rows-[35rem] gap-6 mx-auto p-6 md:p-8 lg:p-12">
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
      </section>
      <section>
        <Numeros />
      </section>
    </div>
  );
};

export default AboutPage;