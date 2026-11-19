import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateTicketModal } from '../components/tickets/CreateTickets';
import { categoriasService } from '../services/categorias.service';
import type { Categoria } from '../types/categoria';
import type { Ticket } from '../types/ticket';

export default function NuevoTicketPage() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setLoading(true);
      setError(null);
      try {
        const data = await categoriasService.list();
        if (active) setCategorias(data);
      } catch {
        if (active) setError('No se pudieron cargar las categorías.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCategories();
    return () => {
      active = false;
    };
  }, []);

  const handleCreated = (ticket: Ticket) => {
    navigate(`/mis-solicitudes/${ticket.id}`, { replace: true });
  };

  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-sm font-medium text-teal-700">Soporte interno</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        Crear una solicitud
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Describe el problema y el equipo de soporte dará seguimiento.
      </p>

      {loading ? (
        <div
          aria-label="Cargando categorías"
          className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
          <div className="h-11 animate-pulse rounded bg-slate-100" />
          <div className="h-24 animate-pulse rounded bg-slate-100" />
        </div>
      ) : error ? (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      ) : categorias.length === 0 ? (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          Aún no hay categorías disponibles. Contacta al equipo de soporte.
        </p>
      ) : (
        <CreateTicketModal
          categorias={categorias}
          onClose={() => navigate('/mis-solicitudes')}
          onCreated={handleCreated}
        />
      )}
    </section>
  );
}
