import { CountUp } from "@/components/about/CountUp";
import { useInView } from "react-intersection-observer";

const Numeros = () => {
  // Detectar cuando el componente entra en la vista
  const { ref, inView } = useInView({
    triggerOnce: true, // Se activa solo una vez
    threshold: 0.5, // Se activa cuando el 50% del elemento es visible
  });
  
  return (
    <section
      ref={ref}
      className="w-full max-w-[1300px] mx-auto p-6 md:p-8 lg:p-10 bg-cream dark:bg-oscuro/70 rounded-lg mt-4 shadow-md mb-8"
    >
      <h2 className="text-3xl lg:text-6xl text-center text-balance font-body4 tracking-widest dark:text-dorado mb-2 lg:mb-4 font-semibold font-lexend text-choco  drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
        Bocaditos Yomi's
      </h2>
      <h3 className="text-2xl lg:text-4xl text-center text-balance dark:text-cream mb-6 lg:mb-10 font-semibold font-lexend text-choco drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
        en números
      </h3>
      <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-3 text-oscuro dark:text-cream ">
        {/* Transacciones Realizadas */}
        <div className="flex flex-col justify-center items-center">
          <span className="number text-4xl lg:text-6xl font-bold tabular-nums tracking-tighter">
            +{inView && <CountUp initial={0} final={100} />}M
          </span>
          <span className="uppercase opacity-70 text-center">
            Transacciones Realizadas
          </span>
        </div>

        {/* Nuestros Clientes */}
        <div className="flex flex-col justify-center items-center">
          <span className="number text-4xl lg:text-6xl font-bold tabular-nums tracking-tighter">
            +{inView && <CountUp initial={0} final={800} />}
          </span>
          <span className="uppercase opacity-70 text-center">
            Nuestros Clientes
          </span>
        </div>

        {/* Años de experiencia */}
        <div className="flex flex-col justify-center items-center">
          <span className="number text-4xl lg:text-6xl font-bold tabular-nums tracking-tighter">
            +{inView && <CountUp initial={0} final={10} />}
          </span>
          <span className="uppercase opacity-70 text-center">
            Años de experiencia
          </span>
        </div>
      </div>
    </section>
  );
};

export default Numeros;