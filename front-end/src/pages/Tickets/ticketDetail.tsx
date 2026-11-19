import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ticketService } from '../../services/tickect.service';
import { TicketBadge } from '../../components/tickets/TicketBadge';
import { TicketPriorityBadge } from '../../components/tickets/TicketPriorityBadge';
import { UpdateEstadoModal } from '../../components/tickets/UpdateTicket';
import type { Ticket } from '../../types/ticket';
import ComentariosTicket from '../../components/comentarios/ComentariosTicket';
import { useAuthStore } from '../../store/useAuthStore';

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const rutaTickets =
    usuario?.rol === 'EMPLEADO'
      ? '/mis-solicitudes'
      : usuario?.rol === 'AGENTE'
        ? '/mis-tickets'
        : '/tickets';

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ticketService
      .getByid(Number(id))
      .then(setTicket)
      .catch((e) => {
        if (axios.isAxiosError(e) && e.response?.status === 400) {
          setError('No tienes permiso para ver este ticket.');
        } else if (axios.isAxiosError(e) && e.response?.status === 404) {
          setError('Ticket no encontrado.');
        } else {
          setError('Error al cargar el ticket.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="h-40 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate(rutaTickets)}
          className="text-teal-600 hover:underline"
        >
          ← Volver a mis solicitudes
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to={rutaTickets}
        className="text-sm text-teal-600 hover:underline"
      >
        ← Volver a mis solicitudes
      </Link>

      <header className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-slate-400">#{ticket.id}</p>
            <h1 className="mt-1 text-2xl font-bold">{ticket.titulo}</h1>
          </div>
          <button
            onClick={() => setShowUpdate(true)}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Cambiar estado
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <TicketBadge estado={ticket.estado} />
          <TicketPriorityBadge prioridad={ticket.prioridad} />
          <span className="text-slate-500">
            Categoría: <strong>{ticket.categoria?.nombre ?? '—'}</strong>
          </span>
          <span className="text-slate-500">
            Creado: {new Date(ticket.creado).toLocaleString('es-MX')}
          </span>
        </div>

        {ticket.descripcion && (
          <p className="whitespace-pre-line border-t border-slate-100 pt-4 text-slate-700">
            {ticket.descripcion}
          </p>
        )}
      </header>
      {/* Historial de comentarios del ticket */}
      <ComentariosTicket ticketId={ticket.id} />

      {showUpdate && (
        <UpdateEstadoModal
          ticket={ticket}
          onClose={() => setShowUpdate(false)}
          onUpdated={(updated) => {
            // El PATCH del backend no devuelve categoria/usuario → merge para no perderlos
            setTicket((prev) => (prev ? { ...prev, ...updated } : updated));
            setShowUpdate(false);
          }}
        />
      )}
    </div>
  );
}
