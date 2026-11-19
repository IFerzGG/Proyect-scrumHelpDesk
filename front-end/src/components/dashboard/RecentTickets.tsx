import StatusBadge from '../ui/StatusBadge';

export interface TicketReciente {
  id: string;
  titulo: string;
  categoria: string;
  estado: 'Abierto' | 'En proceso' | 'Resuelto' | 'Cerrado';
}

interface RecentTicketsProps {
  tickets: TicketReciente[];
}

export default function RecentTickets({ tickets }: RecentTicketsProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-semibold">Solicitudes recientes</h2>

      <p className="mt-1 text-xs text-slate-400">
        Últimos movimientos del equipo
      </p>

      <div className="mt-4 divide-y divide-slate-100">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="flex items-center gap-3 py-3.5">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-xs font-semibold text-slate-500">
              {ticket.titulo.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {ticket.titulo}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {ticket.id} · {ticket.categoria}
              </p>
            </div>

            <StatusBadge estado={ticket.estado} />
          </div>
        ))}

        {tickets.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-400">
            No hay solicitudes recientes.
          </p>
        )}
      </div>
    </article>
  );
}
