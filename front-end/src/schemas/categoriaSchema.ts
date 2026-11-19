import { z } from 'zod';

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .regex(/\S/, 'El nombre no puede contener solo espacios'),

  descripcion: z
    .string()
    .optional()
    .refine(
      (valor) => valor === undefined || (valor.length >= 2 && /\S/.test(valor)),
      'La descripción debe tener al menos 2 caracteres y no contener solo espacios',
    ),
});

export const actualizarCategoriaSchema = categoriaSchema.partial();

export type CategoriaFormValues = z.infer<typeof categoriaSchema>;
export type ActualizarCategoriaFormValues = z.infer<
  typeof actualizarCategoriaSchema
>;
