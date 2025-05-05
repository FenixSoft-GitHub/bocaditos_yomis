import { BiWorld } from "react-icons/bi";
import { FaHammer } from "react-icons/fa6";
import { HiMiniReceiptRefund } from "react-icons/hi2";
import { MdLocalShipping } from "react-icons/md";


export const features = [
  {
    icon: <MdLocalShipping size={40} />,
    title: "Envío gratis",
    description: "En todos nuestros productos - ciertas condiciones aplican",
  },
  {
    icon: <HiMiniReceiptRefund size={40} />,
    title: "Devoluciones",
    description:
      "Devuelve el equipo si no te satisface la compra dentro de 72 horas - ciertas condiciones aplican",
  },
  {
    icon: <FaHammer size={40} />,
    title: "Soporte 24/7",
    description:
      "Soporte técnico en cualquier momento - ciertas condiciones aplican",
  },
  {
    icon: <BiWorld size={40} />,
    title: "Garantía",
    description:
      "Garantía de 1 año en todos los equipos - ciertas condiciones aplican",
  },
];
