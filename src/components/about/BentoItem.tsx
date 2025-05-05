
interface Props {
  title: string;
  description: string;
  description2?: string;
  url: string;
  classCol: string;
  classMax: string;
} 

const BentoItem = ({ title, description, description2, url, classCol, classMax }: Props) => {
  return (
    <div className={`col-span-10 ${classCol} relative rounded-xl overflow-hidden group bg-gray-800 p-6`}>
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-80 bg-blend-luminosity"
        style={{ backgroundImage: `url('${url}')` }}
      />
      <div className="relative z-10 text-cream flex flex-col justify-end h-full">
        <h2 className="text-3xl font-semibold mb-2">{title}</h2>
        <p className={`${classMax} text-base md:text-lg`}>{description}</p>
        {description2 && <p className={`${classMax} text-base md:text-lg`}>{description2}</p>}
      </div>
    </div>
  )
} 

export default BentoItem