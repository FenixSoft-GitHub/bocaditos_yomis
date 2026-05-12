import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { ReactNode } from "react";

export interface ContactItem {
  icon: ReactNode;
  label: string;
  value: string;
  link?: string;
}

export const contactItems: ContactItem[] = [
  {
    icon: <MapPin className="size-6" />,
    label: "Dirección",
    value: "Urb. Las Cayenas, Maturín - Monagas - Venezuela",
    link: "/contact-us#location",
  },
  {
    icon: <Mail className="size-6" />,
    label: "Correo",
    value: "atencion@fenixtechnology.com",
    link: "mailto:atencion@fenixtechnology.com",
  },
  {
    icon: <Phone className="size-6" />,
    label: "Teléfono",
    value: "+58 (412) 499-88-11",
    link: "https://wa.me/+584124998811",
  },
  {
    icon: <Clock className="size-6" />,
    label: "Horario",
    value: "Lunes a Viernes, 8:00 AM - 7:00 PM (VET)",
  },
];
