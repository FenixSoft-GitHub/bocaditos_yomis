import { LuMapPin, LuPhoneCall, LuClock3 } from "react-icons/lu";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { ReactNode } from "react";

export interface ContactItem {
  icon: ReactNode;
  label: string;
  value: string;
  link?: string;
}

export const contactItems: ContactItem[] = [
  {
    icon: <LuMapPin className="h-6 w-6" />,
    label: "Dirección",
    value: "Urb. Las Cayenas, Maturín - Monagas - Venezuela",
    link: "/contact-us#location",
  },
  {
    icon: <HiOutlineEnvelope className="h-6 w-6" />,
    label: "Correo",
    value: "atencion@fenixtechnology.com",
    link: "mailto:atencion@fenixtechnology.com",
  },
  {
    icon: <LuPhoneCall className="h-6 w-6" />,
    label: "Teléfono",
    value: "+58 (412) 499-88-11",
    link: "https://wa.me/+584124998811",
  },
  {
    icon: <LuClock3 className="h-6 w-6" />,
    label: "Horario",
    value: "Lunes a Viernes, 8:00 AM - 7:00 PM (VET)",
  },
];
