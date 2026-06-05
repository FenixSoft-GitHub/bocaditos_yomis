import { contactItems } from "@/constants/contactData";

export const ContactInfo = () => (
  <div className="flex flex-col gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-cocoa mb-1">
        Información de contacto
      </p>
      <h3 className="text-xl font-bold text-choco dark:text-cream">
        ¿Cómo llegar a nosotros?
      </h3>
      <p className="text-sm text-choco/60 dark:text-cream/60 mt-1 leading-relaxed">
        Estamos disponibles para responder cualquier consulta.
      </p>
    </div>

    <div className="flex flex-col gap-3 mt-2">
      {contactItems.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-4 p-3 rounded-xl bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10 hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors group"
        >
          <div className="size-9 rounded-lg bg-choco dark:bg-cream flex items-center justify-center shrink-0 text-cream dark:text-oscuro group-hover:scale-110 transition-transform duration-200">
            {item.icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-choco/50 dark:text-cream/50 mb-0.5">
              {item.label}
            </p>
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-choco dark:text-cream hover:text-cocoa dark:hover:text-cocoa transition-colors break-words"
              >
                {item.value}
              </a>
            ) : (
              <p className="text-sm font-medium text-choco dark:text-cream break-words">
                {item.value}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);