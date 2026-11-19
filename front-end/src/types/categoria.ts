export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  creado: string;
}

export interface CrearCategoriaDTO {
  nombre: string;
  descripcion?: string;
}

export type ActualizarCategoriaDTO = Partial<CrearCategoriaDTO>;
