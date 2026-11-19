import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/tickect.service';
import { categoriasService } from '../../services/categorias.service';
import type { Ticket } from '../../types/ticket';
import type { Categoria } from '../../types/categoria';
import { TicketBadge } from '../../components/tickets/TicketBadge';
import { TicketPriorityBadge } from '../../components/tickets/TicketPriorityBadge';
import { TicketFiltersBar } from '../../components/tickets/TicketFilters';
import {
  EMPTY_FILTERS,
  useTicketFilters,
  type TicketFilter,
} from '../../hooks/useTicketFilters';
import { CreateTicketModal } from '../../components/tickets/CreateTickets';

export function TicketsListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TicketFilter>(EMPTY_FILTERS);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useTicketFilters(tickets, filters);

  const load = async () => {
    setLoading(true);
    setError(null);

    const [ticketsRes, categoriasRes] = await Promise.allSettled([
      ticketService.list(),
      categoriasService.list(),
    ]);

    if (ticketsRes.status === 'fulfilled' && Array.isArray(ticketsRes.value)) {
      setTickets(ticketsRes.value);
    } else {
      setTickets([]);
      setError('No se pudieron cargar los tickets. Intenta de nuevo.');
    }

    if (
      categoriasRes.status === 'fulfilled' &&
      Array.isArray(categoriasRes.value)
    ) {
      setCategorias(categoriasRes.value);
    } else {
      setCategorias([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <SkeletonList />;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis solicitudes</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          + Nuevo ticket
        </button>
      </div>

      <TicketFiltersBar
        filters={filters}
        categorias={categorias}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      <p className="text-sm text-slate-500">
        {filtered.length} de {tickets.length} tickets
      </p>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-slate-500">
          No hay tickets que coincidan con los filtros.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Título</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Prioridad</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Creado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-mono text-slate-500">
                    #{t.id}
                  </td>
                  <td className="px-4 py-3 font-medium">{t.titulo}</td>
                  <td className="px-4 py-3">{t.categoria?.nombre ?? '—'}</td>
                  <td className="px-4 py-3">
                    <TicketPriorityBadge prioridad={t.prioridad} />
                  </td>
                  <td className="px-4 py-3">
                    <TicketBadge estado={t.estado} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(t.creado).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/mis-solicitudes/${t.id}`}
                      className="text-sm text-teal-600 hover:underline"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <CreateTicketModal
          categorias={categorias}
          onClose={() => setShowCreate(false)}
          onCreated={(t) => {
            const enriched: Ticket = {
              ...t,
              categoria: categorias.find((c) => c.id === t.categoriaId),
            };
            setTickets((prev) => [enriched, ...prev]);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded bg-slate-200" />
      ))}
    </div>
  );
}
