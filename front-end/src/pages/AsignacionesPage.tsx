import { useEffect, useMemo, useState } from 'react';
import {
  ClipboardList,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  UserRoundPlus,
  ArrowRightLeft,
} from 'lucide-react';

import { ticketService } from '../services/tickect.service';
import { usuariosService, type UsuarioListado } from '../services/usuarios.ts';

import { TicketBadge } from '../components/tickets/TicketBadge';
import { TicketPriorityBadge } from '../components/tickets/TicketPriorityBadge';
import { AsignarAgenteModal } from '../components/asignaciones/AsignarAgenteModal';

import type { Ticket } from '../types/ticket';

type FiltroAsignacion = 'TODOS' | 'ASIGNADOS' | 'SIN_ASIGNAR';

export default function AsignacionesPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [agentes, setAgentes] = useState<UsuarioListado[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<FiltroAsignacion>('TODOS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(
    null,
  );
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);

    try {
      const [ticketsData, agentesData] = await Promise.all([
        ticketService.list(),
        usuariosService.getAgentes(),
      ]);

      setTickets(ticketsData);
      setAgentes(agentesData);
    } catch {
      setError('No se pudieron cargar las asignaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  const totalAsignados = tickets.filter(
    (ticket) => ticket.agenteId != null,
  ).length;

  const totalSinAsignar = tickets.length - totalAsignados;

  const ticketsFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const coincideBusqueda =
        `${ticket.id} ${ticket.titulo} ${ticket.usuario?.nombre ?? ''} ${ticket.agente?.nombre ?? ''}`
          .toLowerCase()
          .includes(termino);

      const coincideEstado =
        filtro === 'TODOS' ||
        (filtro === 'ASIGNADOS' && ticket.agenteId != null) ||
        (filtro === 'SIN_ASIGNAR' && ticket.agenteId == null);

      return coincideBusqueda && coincideEstado;
    });
  }, [tickets, busqueda, filtro]);

  const asignacionGuardada = async () => {
    setTicketSeleccionado(null);
    setMensaje('Asignación actualizada correctamente.');
    await cargarDatos();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Asignaciones</h1>

        <p className="mt-1 text-sm text-slate-500">
          Administra los agentes responsables de cada ticket.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            titulo: 'Total tickets',
            valor: tickets.length,
            icono: ClipboardList,
          },
          {
            titulo: 'Asignados',
            valor: totalAsignados,
            icono: UserCheck,
          },
          {
            titulo: 'Sin asignar',
            valor: totalSinAsignar,
            icono: UserX,
          },
        ].map((item) => {
          const Icono = item.icono;

          return (
            <div
              key={item.titulo}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
                  <Icono size={23} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">{item.titulo}</p>

                  <p className="text-2xl font-bold text-slate-900">
                    {item.valor}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar ticket o agente..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ['TODOS', 'Todos'],
                ['ASIGNADOS', 'Asignados'],
                ['SIN_ASIGNAR', 'Sin asignar'],
              ] as const
            ).map(([valor, etiqueta]) => (
              <button
                key={valor}
                type="button"
                onClick={() => setFiltro(valor)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  filtro === valor
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {etiqueta}
              </button>
            ))}

            <button
              type="button"
              onClick={() => void cargarDatos()}
              disabled={loading}
              aria-label="Actualizar asignaciones"
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={19} />
            </button>
          </div>
        </div>
      </div>

      {mensaje && (
        <p
          role="status"
          className="rounded-xl bg-teal-50 p-4 text-sm text-teal-800"
        >
          {mensaje}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Listado de asignaciones
          </h2>

          <span className="text-xs text-slate-500">
            {ticketsFiltrados.length} resultados
          </span>
        </div>

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
                  <th className="px-5 py-4">Solicitante</th>
                  <th className="px-5 py-4">Prioridad</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Agente</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
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
                      {ticket.usuario?.nombre ?? 'Sin solicitante'}
                    </td>

                    <td className="px-5 py-4">
                      <TicketPriorityBadge prioridad={ticket.prioridad} />
                    </td>

                    <td className="px-5 py-4">
                      <TicketBadge estado={ticket.estado} />
                    </td>

                    <td className="px-5 py-4">
                      {ticket.agente ? (
                        <span className="font-medium text-slate-700">
                          {ticket.agente.nombre}
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                          Sin asignar
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setMensaje(null);
                            setTicketSeleccionado(ticket);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50"
                        >
                          {ticket.agenteId ? (
                            <>
                              <ArrowRightLeft size={16} />
                              Reasignar
                            </>
                          ) : (
                            <>
                              <UserRoundPlus size={16} />
                              Asignar
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {ticketSeleccionado && (
        <AsignarAgenteModal
          ticket={ticketSeleccionado}
          agentes={agentes}
          onClose={() => setTicketSeleccionado(null)}
          onAssigned={asignacionGuardada}
        />
      )}
    </div>
  );
}
