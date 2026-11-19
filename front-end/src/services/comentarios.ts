import { api } from './api';

import type { Comentario, CrearComentarioDTO } from '../types/comentario';

export const comentariosService = {
  async getByTicket(ticketId: number): Promise<Comentario[]> {
    const { data } = await api.get<Comentario[]>(
      `/comentarios/ticket/${ticketId}`,
    );
    return data;
  },

  async create(
    ticketId: number,
    datos: CrearComentarioDTO,
  ): Promise<Comentario> {
    const { data } = await api.post<Comentario>(
      `/comentarios/ticket/${ticketId}`,
      datos,
    );
    return data;
  },
};
