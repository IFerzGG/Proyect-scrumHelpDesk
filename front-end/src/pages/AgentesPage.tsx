import { useEffect, useMemo, useState } from 'react';
import { Users, Search, RefreshCw, Mail, Headset } from 'lucide-react';

import { usuariosService, type UsuarioListado } from '../services/usuarios.ts';

export default function AgentesPage() {
  const [agentes, setAgentes] = useState<UsuarioListado[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarAgentes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await usuariosService.getAgentes();
      setAgentes(data);
    } catch {
      setError('No se pudieron cargar los agentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarAgentes();
  }, []);

  const agentesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return agentes.filter((agente) =>
      `${agente.nombre} ${agente.apellido} ${agente.email}`
        .toLowerCase()
        .includes(termino),
    );
  }, [agentes, busqueda]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Agentes de soporte
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Consulta los agentes registrados en HelpDesk.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <Headset size={24} />
          </div>

          <div>
            <p className="text-sm text-slate-500">Agentes registrados</p>
            <p className="text-2xl font-bold text-slate-900">
              {agentes.length}
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
            placeholder="Buscar por nombre o correo..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500"
          />
        </div>

        <button
          type="button"
          onClick={() => void cargarAgentes()}
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

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : agentesFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Users size={32} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            No se encontraron agentes.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agentesFiltrados.map((agente) => (
            <div
              key={agente.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-100 font-semibold text-teal-700">
                  {agente.nombre.charAt(0)}
                  {agente.apellido.charAt(0)}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-slate-900">
                    {agente.nombre} {agente.apellido}
                  </h2>
                  <span className="text-xs font-medium text-teal-700">
                    Agente de soporte
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail size={16} className="shrink-0" />
                  <span className="truncate">{agente.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
