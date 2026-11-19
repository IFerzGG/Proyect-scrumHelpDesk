import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket as TicketIcon,
  Search,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';

import { ticketService } from '../services/tickect.service';
import { TicketBadge } from '../components/tickets/TicketBadge';
import { TicketPriorityBadge } from '../components/tickets/TicketPriorityBadge';

import type { Ticket } from '../types/ticket';

export default function TodosTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ticketService.list();
      setTickets(data);
    } catch {
      setError('No se pudieron cargar los tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarTickets();
  }, []);

  const ticketsFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return tickets.filter((ticket) =>
      `${ticket.id} ${ticket.titulo} ${ticket.categoria?.nombre ?? ''}`
        .toLowerCase()
        .includes(termino),
    );
  }, [tickets, busqueda]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Todos los tickets</h1>

        <p className="mt-1 text-sm text-slate-500">
          Consulta y supervisa las solicitudes de soporte.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <TicketIcon size={24} />
          </div>

          <div>
            <p className="text-sm text-slate-500">Tickets disponibles</p>
            <p className="text-2xl font-bold text-slate-900">
              {tickets.length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título, ID o categoría..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500"
          />
        </div>

        <button
          type="button"
          onClick={() => void cargarTickets()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Actualizar
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : ticketsFiltrados.length === 0 ? (
          <div className="py-14 text-center text-sm text-slate-500">
            No se encontraron tickets.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">Ticket</th>
                  <th className="px-5 py-4">Categoría</th>
                  <th className="px-5 py-4">Prioridad</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Creado</th>
                  <th className="px-5 py-4">Solicitante</th>
                  <th className="px-5 py-4">Agente asignado</th>
                  <th className="px-5 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {ticketsFiltrados.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {ticket.titulo}
                      </p>
                      <p className="text-xs text-slate-400">#{ticket.id}</p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {ticket.categoria?.nombre ?? 'Sin categoría'}
                    </td>

                    <td className="px-5 py-4">
                      <TicketPriorityBadge prioridad={ticket.prioridad} />
                    </td>

                    <td className="px-5 py-4">
                      <TicketBadge estado={ticket.estado} />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {new Date(ticket.creado).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {ticket.usuario?.nombre ?? 'Sin solicitante'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {ticket.agente?.nombre ?? 'Sin asignar'}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/mis-solicitudes/${ticket.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline"
                      >
                        Ver detalle
                        <ArrowUpRight size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
