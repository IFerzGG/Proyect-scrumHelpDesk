import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FolderOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Tags,
} from 'lucide-react';

import { categoriasService } from '../services/categorias.service';
import { CategoriaFormModal } from '../components/comentarios/categorias/CategoriaFormModal';
import { EliminarCategoriaModal } from '../components/comentarios/categorias/EliminarCategoriaModal';

import type { Categoria } from '../types/categoria';

type Modal =
  | { tipo: 'crear' }
  | { tipo: 'editar'; categoria: Categoria }
  | { tipo: 'eliminar'; categoria: Categoria }
  | null;

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<Modal>(null);

  const cargarCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await categoriasService.list();
      setCategorias(data);
    } catch {
      setError('No se pudieron cargar las categorías.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarCategorias();
  }, [cargarCategorias]);

  const categoriasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase('es');

    return categorias.filter((categoria) =>
      categoria.nombre.toLocaleLowerCase('es').includes(termino),
    );
  }, [categorias, busqueda]);

  const despuesDeGuardar = async () => {
    setModal(null);
    await cargarCategorias();
  };

  const despuesDeEliminar = async () => {
    setModal(null);
    await cargarCategorias();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Categorías
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Administra las categorías utilizadas para clasificar tickets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ tipo: 'crear' })}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700"
        >
          <Plus size={18} />
          Nueva categoría
        </button>
      </div>

      {/* Resumen */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <Tags size={23} />
          </div>

          <div>
            <p className="text-sm text-slate-500">Categorías registradas</p>
            <p className="text-2xl font-bold text-slate-900">
              {categorias.length}
            </p>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar categoría..."
              aria-label="Buscar categoría"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          <button
            type="button"
            onClick={() => void cargarCategorias()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Listado de categorías
          </h2>

          <span className="text-xs text-slate-500">
            {categoriasFiltradas.length} resultados
          </span>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <FolderOpen size={28} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              {busqueda
                ? 'No se encontraron categorías'
                : 'Todavía no hay categorías'}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {busqueda
                ? 'Prueba con otro término de búsqueda.'
                : 'Crea una categoría para comenzar.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nombre</th>
                  <th className="px-6 py-4 font-semibold">Descripción</th>
                  <th className="px-6 py-4 font-semibold">Creación</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {categoriasFiltradas.map((categoria) => (
                  <tr
                    key={categoria.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700">
                          <Tags size={17} />
                        </div>

                        <span className="font-medium text-slate-900">
                          {categoria.nombre}
                        </span>
                      </div>
                    </td>

                    <td className="max-w-sm px-6 py-4 text-slate-600">
                      {categoria.descripcion || 'Sin descripción'}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {new Date(categoria.creado).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setModal({
                              tipo: 'editar',
                              categoria,
                            })
                          }
                          title="Editar categoría"
                          aria-label={`Editar ${categoria.nombre}`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-teal-50 hover:text-teal-700"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setModal({
                              tipo: 'eliminar',
                              categoria,
                            })
                          }
                          title="Eliminar categoría"
                          aria-label={`Eliminar ${categoria.nombre}`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
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

      {/* Modales */}
      {modal?.tipo === 'crear' && (
        <CategoriaFormModal
          categoria={null}
          onClose={() => setModal(null)}
          onSaved={despuesDeGuardar}
        />
      )}

      {modal?.tipo === 'editar' && (
        <CategoriaFormModal
          categoria={modal.categoria}
          onClose={() => setModal(null)}
          onSaved={despuesDeGuardar}
        />
      )}

      {modal?.tipo === 'eliminar' && (
        <EliminarCategoriaModal
          categoria={modal.categoria}
          onClose={() => setModal(null)}
          onDeleted={despuesDeEliminar}
        />
      )}
    </div>
  );
}
