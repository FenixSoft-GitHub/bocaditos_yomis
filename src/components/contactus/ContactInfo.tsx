import { contactItems } from "@/constants/contactData";

export const ContactInfo = () => {
  return (
    <div className="w-full max-w-lg mx-auto space-y-14 text-choco dark:text-cream bg-cream dark:bg-fondo-dark dark:border dark:border-choco/50 p-6 rounded-2xl shadow-md">
      <h3 className="text-2xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
        Información de Contacto
      </h3>

      <div className="space-y-6">
        {contactItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 rounded-lg transition-all">
            <div className="flex items-center justify-center p-3 bg-choco text-cream dark:bg-cream/70 dark:text-choco rounded-full hover:scale-125 transition-all ease-in-out duration-300">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-oscuro dark:text-cream/70 ">
                {item.label}
              </p>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-choco dark:text-cream hover:underline break-words"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-base text-choco dark:text-cream break-words">
                  {item.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};