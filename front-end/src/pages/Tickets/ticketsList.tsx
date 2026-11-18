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
    try {
      const [ts, cs] = await Promise.all([
        ticketService.list(),
        categoriasService.list(),
      ]);
      setTickets(ts);
      setCategorias(cs);
    } catch {
      setError('No se pudieron cargar los tickets. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <SkeletonList />;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis tickets</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
        <p className="text-center py-10 text-slate-500">
          No hay tickets que coincidan con los filtros.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
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
                <tr key={t.id} className="border-t hover:bg-slate-50">
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
                    {new Date(t.creado).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/tickets/${t.id}`}
                      className="text-blue-600 hover:underline text-sm"
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
            setTickets((prev) => [t, ...prev]);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="p-6 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-200 animate-pulse rounded" />
      ))}
    </div>
  );
}
