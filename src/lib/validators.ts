// import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

export const userRegisterSchema = z.object({
	email: z.string().email('El correo electrónico no es válido'),
	password: z
		.string()
		.min(6, 'La contraseña debe tener al menos 6 caracteres'),
	fullName: z.string().min(1, 'El nombre completo es requerido'),
	phone: z.string().optional(),
});

export type UserRegisterFormValues = z.infer<typeof userRegisterSchema>;

export const addressSchema = z.object({
  addressLine1: z
    .string()
    .min(1, "La dirección es requerida")
    .max(100, "La dirección no debe exceder los 100 carácteres"),
  addressLine2: z
    .string()
    .max(100, "La dirección no debe exceder los 100 carácteres")
    .optional(),
  city: z
    .string()
    .min(1, "La ciudad es requerida")
    .max(50, "La ciudad no debe exceder los 50 carácteres"),
  state: z
    .string()
    .min(1, "El estado es requerido")
    .max(50, "El estado no debe exceder los 50 carácteres"),
  postalCode: z
    .string()
    .max(10, "El código postal no debe exceder los 10 carácteres")
    .optional(),
  country: z.string().min(1, "El país es requerido"),
  delivery_option_id: z.string().min(1, "Selecciona una opción"),
//   promo_code_id: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export const productSchema = z.object({
  id: z.string().uuid().optional(), // Se genera automáticamente
  category_id: z.string().uuid({ message: "Categoría inválida" }),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.coerce.number().nonnegative("El precio no puede ser negativo"),
  image_url: z.array(z.any()).min(1, "Debe haber al menos una imagen"),
  stock: z.coerce
    .number()
    .int()
    .nonnegative("El stock no puede ser negativo")
    .nullable()
    .optional(),
  created_at: z.coerce.date().nullable().optional(),
  updated_at: z.coerce.date().nullable().optional(),
  slug: z
    .string()
    .min(1, "El slug del producto es obligatorio")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  created_at: z.coerce.date().optional(), // Se asigna automáticamente
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const deliveryOptionSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no debe exceder los 100 caracteres"),

  price: z.coerce
    .number({ invalid_type_error: "El precio debe ser un número" })
    .nonnegative("El precio no puede ser negativo"),

  estimated_time: z
    .string()
    .min(3, "El tiempo estimado es requerido")
    .max(50, "El tiempo estimado no debe exceder los 50 caracteres"),

  created_at: z.string().nullable().optional(), // Solo si lo recibes del backend

  id: z.string().optional(), // Solo en modo edición
});

export type DeliveryOptionFormValues = z.infer<typeof deliveryOptionSchema>; 

export const promoCodeSchema = z.object({
    code: z.string().min(1, "El código es obligatorio"),
    created_at: z.string().nullable().optional(),
    discount_percent: z.coerce
      .number()
      .min(0, "El descuento no puede ser negativo")
      .max(100, "El descuento no puede superar el 100%"),
    id: z.string().optional(),
    is_active: z.boolean().nullable(),
    valid_from: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha de inicio no es válida",
    }),
    valid_until: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha de expiración no es válida",
    }),
  })
  .refine(
    (data) => {
      const validFrom = new Date(data.valid_from);
      const validUntil = new Date(data.valid_until);
      return validUntil >= validFrom; // Asegura que valid_until no sea menor que valid_from
    },
    {
      message:
        "La fecha de expiración no puede ser menor que la fecha de inicio",
      path: ["valid_until"], // Aplica el error a la propiedad 'valid_until'
    }
  );

  export type PromoCodeFormValues = z.infer<typeof promoCodeSchema>;