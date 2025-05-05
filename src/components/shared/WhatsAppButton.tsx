import { BsWhatsapp } from "react-icons/bs";

const WhatsAppButton = () => {
  const whatsappNumber = '+584124998811';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-7 right-7 bg-[#25D366] hover:bg-[#075E54] text-white hover:scale-105 hover:rotate-20 transition-transform duration-500 rounded-full shadow-lg p-2.5 z-50"
    >
      <BsWhatsapp size={38} />
    </a>
  );
};

export default WhatsAppButton;