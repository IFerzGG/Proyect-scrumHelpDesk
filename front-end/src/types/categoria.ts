export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  creado: string;
}

export interface CrearCateoriaPayload {
  nombre: string;
  descripcion?: string;
}

export type UpdateCategoriaPayload = Partial<CrearCateoriaPayload>