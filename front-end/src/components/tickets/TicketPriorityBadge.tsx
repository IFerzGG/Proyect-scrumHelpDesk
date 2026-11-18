import type { Prioridad } from '../../types/ticket';

const COLORS: Record<Prioridad, string> = {
  CRITICO: 'bg-red-600 text-white',
  ALTA: 'bg-orange-500 text-white',
  MEDIA: 'bg-yellow-400 text-black',
  BAJA: 'bg-slate-300 text-black',
};

export function TicketPriorityBadge({ prioridad }: { prioridad: Prioridad }) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-bold ${COLORS[prioridad]}`}
    >
      {prioridad}
    </span>
  );
}
