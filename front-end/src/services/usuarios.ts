import { api } from './api';
import type { Rol } from '../types/auth';

export interface UsuarioListado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  role: Rol;
}

export const usuariosService = {
  async getAgentes(): Promise<UsuarioListado[]> {
    const { data } = await api.get<UsuarioListado[]>('/users', {
      params: {
        roleUsuario: 'AGENTE',
      },
    });

    return data;
  },
};
