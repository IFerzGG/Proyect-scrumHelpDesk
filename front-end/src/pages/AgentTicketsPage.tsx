import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Ticket as TicketIcon } from 'lucide-react';

import { TicketBadge } from '../components/tickets/TicketBadge';
import { TicketPriorityBadge } from '../components/tickets/TicketPriorityBadge';
import { TicketFiltersBar } from '../components/tickets/TicketFilters';
import {
  EMPTY_FILTERS,
  useTicketFilters,
  type TicketFilter,
} from '../hooks/useTicketFilters';
import { categoriasService } from '../services/categorias.service';
import { ticketService } from '../services/tickect.service';
import { useAuthStore } from '../store/useAuthStore';
import type { Categoria } from '../types/categoria';
import type { Ticket } from '../types/ticket';

export default function AgentTicketsPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filters, setFilters] = useState<TicketFilter>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [ticketsResult, categoriesResult] = await Promise.allSettled([
      ticketService.list(),
      categoriasService.list(),
    ]);

    if (ticketsResult.status === 'fulfilled') {
      if (Array.isArray(ticketsResult.value)) {
        setTickets(
          ticketsResult.value.filter(
            (ticket) => ticket.agenteId === usuario?.id,
          ),
        );
      } else {
        setTickets([]);
        setError('La API devolvió un formato de tickets inválido.');
      }
    } else {
      setTickets([]);
      setError('No se pudieron cargar tus tickets. Intenta actualizar.');
    }

    if (categoriesResult.status === 'fulfilled') {
      setCategorias(categoriesResult.value);
    } else {
      setCategorias([]);
      setError((current) =>
        current
          ? `${current} No se pudieron cargar las categorías de los filtros.`
          : 'No se pudieron cargar las categorías de los filtros.',
      );
    }

    setLoading(false);
  }, [usuario?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const ticketsFiltrados = useTicketFilters(tickets, filters);
  const abiertos = useMemo(
    () => tickets.filter((ticket) => ticket.estado === 'ABIERTO').length,
    [tickets],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-teal-700">Equipo de soporte</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Mis tickets asignados
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Da seguimiento a las incidencias asignadas a tu cuenta.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Tickets asignados</p>
          <p className="mt-3 text-3xl font-semibold">{tickets.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pendientes de atención</p>
          <p className="mt-3 text-3xl font-semibold">{abiertos}</p>
        </article>
      </section>

      <TicketFiltersBar
        filters={filters}
        categorias={categorias}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6" aria-label="Cargando tickets">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : ticketsFiltrados.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <TicketIcon className="size-8 text-slate-300" />
            <p className="mt-3 font-medium text-slate-700">
              No hay tickets que coincidan con los filtros
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Cuando te asignen una solicitud, aparecerá aquí.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold">Bandeja de trabajo</h2>
              <span className="text-xs text-slate-500">
                {ticketsFiltrados.length} tickets
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Ticket</th>
                    <th className="px-5 py-4">Solicitante</th>
                    <th className="px-5 py-4">Categoría</th>
                    <th className="px-5 py-4">Prioridad</th>
                    <th className="px-5 py-4">Estado</th>
                    <th className="px-5 py-4">Acción</th>
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
                        {ticket.usuario?.nombre ?? 'Solicitante'}
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
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                          className="font-medium text-teal-700 hover:underline"
                        >
                          Ver y atender
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
