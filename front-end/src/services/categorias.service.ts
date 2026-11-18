import { api } from '../libs/axios';
import type { Categoria, CrearCateoriaPayload, UpdateCategoriaPayload } from '../types/categoria';


export const categoriasService = {
  list: async (): Promise<Categoria[]> => {
    const { data } = await api.get<Categoria[]>('/categorias');
    return data;
  },

  getById: async (id: number): Promise<Categoria> => {
    const { data } = await api.get<Categoria>(`/categorias/${id}`);
    return data;
  },

  search: async (nombre: string): Promise<Categoria[]> => {
    const { data } = await api.get<Categoria[]>('/categorias/buscar', {
      params: { nombre },
    });
    return data;
  },

  create: async (payload: CrearCateoriaPayload): Promise<Categoria> => {
    const { data } = await api.post<Categoria>('/categorias', payload);
    return data;
  },

  update: async (
    id: number,
    payload: UpdateCategoriaPayload,
  ): Promise<Categoria> => {
    const { data } = await api.patch<Categoria>(`/categorias/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};
