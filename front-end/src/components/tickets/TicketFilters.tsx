import type { Categoria } from '../../types/categoria';
import type { TicketFilter as Filters } from '../../hooks/useTicketFilters';

interface Props {
  filters: Filters;
  categorias: Categoria[];
  onChange: (next: Filters) => void;
  onClear: () => void;
}

export function TicketFiltersBar({ filters, categorias, onChange, onClear }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-4 bg-white p-4 rounded-lg shadow-sm">
      <input
        type="search"
        placeholder="Buscar por título o #ID..."
        className="border rounded px-3 py-2"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <select
        className="border rounded px-3 py-2"
        value={filters.estado}
        onChange={(e) =>
          onChange({ ...filters, estado: e.target.value as Filters['estado'] })
        }
      >
        <option value="TODOS">Todos los estados</option>
        <option value="ABIERTO">Abierto</option>
        <option value="ENPROCESO">En proceso</option>
        <option value="RESUELTO">Resuelto</option>
        <option value="CERRADO">Cerrado</option>
      </select>

      <select
        className="border rounded px-3 py-2"
        value={filters.prioridad}
        onChange={(e) =>
          onChange({ ...filters, prioridad: e.target.value as Filters['prioridad'] })
        }
      >
        <option value="TODAS">Todas las prioridades</option>
        <option value="CRITICO">Crítico</option>
        <option value="ALTA">Alta</option>
        <option value="MEDIA">Media</option>
        <option value="BAJA">Baja</option>
      </select>

      <div className="flex gap-2">
        <select
          className="border rounded px-3 py-2 flex-1"
          value={filters.categoriaId}
          onChange={(e) =>
            onChange({
              ...filters,
              categoriaId:
                e.target.value === 'TODAS' ? 'TODAS' : Number(e.target.value),
            })
          }
        >
          <option value="TODAS">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <button
          onClick={onClear}
          className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}