import type { EstadoTicket } from '../../types/ticket';

const COLORS: Record<EstadoTicket, string> = {
  ABIERTO: 'bg-blue-100 text-blue-800',
  ENPROCESO: 'bg-yellow-100 text-yellow-800',
  RESUELTO: 'bg-green-100 text-green-800',
  CERRADO: 'bg-gray-200 text-gray-700',
};

export function TicketBadge({ estado }: { estado: EstadoTicket }) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${COLORS[estado]}`}
    >
      {estado}
    </span>
  );
}
