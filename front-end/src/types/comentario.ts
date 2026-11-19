import type { Rol } from './auth';

export interface UsuarioComentario {
  id: number;
  nombre: string;
  apellido: string;
  role: Rol;
}

export interface Comentario {
  id: number;
  comentario: string;
  creado: string;
  usuarioId: number;
  ticketId: number;
  usuario: UsuarioComentario;
}

export interface CrearComentarioDTO {
  comentario: string;
}
