// Función para formatear el precio a dólares
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};


// Función para formatear la fecha a formato 3 de enero de 2022
export const formatDateLong = (date: string): string => {
  const dateObject = new Date(date);
  // Corrige la diferencia horaria
  const correctedDate = new Date(
    dateObject.getTime() + dateObject.getTimezoneOffset() * 60000
  );

  return correctedDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Función para formatear la fecha a formato dd/mm/yyyy
export const formatDate = (date: string): string => {
  const dateObject = new Date(date.split("T")[0]);
  // Corrige la diferencia horaria
  const correctedDate = new Date(
    dateObject.getTime() + dateObject.getTimezoneOffset() * 60000
  );

  return correctedDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  });
};

// Función para obtener el estado del pedido en español
export const getStatus = (status: string): string => {
	switch (status) {
		case 'Pending':
			return 'Pendiente';
		case 'Paid':
			return 'Pagado';
		case 'Shipped':
			return 'Enviado';
		case 'Delivered':
			return 'Entregado';
		default:
			return status;
	}
};

// Función para generar el slug de un producto
export const generateSlug = (name: string): string => {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
};

// Función para extraer el path relativo al bucket de una URL
export const extractFilePath = (url: string): string => {
  const match = url.match(/\/storage\/v1\/object\/public\/product-image\/(.+)$/);
  if (!match || !match[1]) {
    throw new Error(`URL de imagen no válida: ${url}`);
  }
  return match[1];
};

export const formatToTwoDecimals = (value: number): string => {
  const num = value;

  if (isNaN(num)) {
    console.warn(
      `Valor inválido proporcionado a formatToTwoDecimals: ${value}. Devolviendo "0,00".`
    );
    return "0,00";
  }
  const formattedWithDot = num.toFixed(2);
  const formattedWithComma = formattedWithDot.replace(".", ",");
  return formattedWithComma;
}