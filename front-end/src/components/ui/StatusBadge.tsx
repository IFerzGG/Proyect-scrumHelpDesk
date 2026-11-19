type EstadoTicket = 'Abierto' | 'En proceso' | 'Resuelto' | 'Cerrado';

interface StatusBadgeProps {
  estado: EstadoTicket;
}

const estilos: Record<EstadoTicket, string> = {
  Abierto: 'bg-blue-50 text-blue-700',
  'En proceso': 'bg-amber-50 text-amber-700',
  Resuelto: 'bg-emerald-50 text-emerald-700',
  Cerrado: 'bg-slate-100 text-slate-600',
};

export default function StatusBadge({ estado }: StatusBadgeProps) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}
