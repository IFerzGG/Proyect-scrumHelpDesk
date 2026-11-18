export type EstadoTicket = 'ABIERTO' | 'ENPROCESO' | 'CERRADO' | 'RESUELTO';
export type Prioridad = 'CRITICO' | 'ALTA' | 'MEDIA' | 'BAJA';
export type Role = 'ADMIN' | 'AGENTE' | 'EMPLEADO';

export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string | null;
  prioridad: Prioridad;
  estado: EstadoTicket;
  creado: string;
  update: string | null;
  agenteId: number | null;
  usuarioId: number;
  categoriaId: number;
  usuario?: { id: number; nombre: string; role: Role };
  agente?: { id: number; nombre: string } | null;
  categoria?: { id: number; nombre: string };
}

export interface CreateTicketPay {
  titulo: string;
  descripcion?: string;
  prioridad: Prioridad;
  categoriaId: number;
}

export interface UpdateTicket {
  estado?: EstadoTicket;
  agenteId?: number;
}

export const EMPLEADO_TRANSITIONS: Record<EstadoTicket, EstadoTicket[]> = {
  ABIERTO: ['CERRADO'],
  ENPROCESO: [],
  RESUELTO: ['CERRADO', 'ENPROCESO'],
  CERRADO: [],
};