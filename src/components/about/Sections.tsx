import { Heart, Target, Eye } from "lucide-react";

export const Sections = [
  {
    id: "historia",
    title: "Nuestra Historia",
    text: "Todo comenzó con una receta de familia, unas ganas inmensas de crear momentos felices… y el aroma irresistible de un bizcocho recién horneado. Bocaditos Yomi's nació del amor por lo artesanal, de esas manos que amasan con cariño y de sueños que se cocinan lento, pero con mucho corazón.",
    image: "/img/about/historia.avif",
    imageAlt: "Nuestra historia",
    reverse: false,
    link: { to: "/about/nuestra-historia", label: "Leer nuestra historia" },
    icon: Heart,
    scenery: "trophies",
    sceneryText: "trophies-text",
  },
  {
    id: "mision",
    title: "Nuestra Misión",
    text: "Brindar experiencias dulces que generen emociones, elaborando productos horneados con dedicación, tradición y creatividad, para acompañar celebraciones y alegrar los días de quienes confían en nosotros.",
    image: "/img/about/mision.avif",
    imageAlt: "Nuestra misión",
    reverse: true,
    icon: Target,
    scenery: "theater",
    sceneryText: "theater-text",
  },
  {
    id: "vision",
    title: "Nuestra Visión",
    text: "Ser la pastelería de referencia en la ciudad, reconocida por nuestro compromiso con la calidad, el trato cercano y la innovación en cada creación que sale de nuestro horno.",
    image: "/img/about/vision.avif",
    imageAlt: "Nuestra visión",
    reverse: false,
    icon: Eye,
    scenery: "trophies",
    sceneryText: "trophies-text",
  },
];
