import { useState } from 'react';
import axios from 'axios';
import { UserRoundCheck, X } from 'lucide-react';

import { ticketService } from '../../services/tickect.service';
import type { Ticket } from '../../types/ticket';
import type { UsuarioListado } from '../../services/usuarios';

interface AsignarAgenteModalProps {
  ticket: Ticket;
  agentes: UsuarioListado[];
  onClose: () => void;
  onAssigned: () => void | Promise<void>;
}

export function AsignarAgenteModal({
  ticket,
  agentes,
  onClose,
  onAssigned,
}: AsignarAgenteModalProps) {
  const [agenteId, setAgenteId] = useState<number | ''>(ticket.agenteId ?? '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const asignar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (agenteId === '') {
      setError('Selecciona un agente.');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await ticketService.update(ticket.id, { agenteId });
      await onAssigned();
    } catch (err) {
      if (axios.isAxiosError<{ message?: string | string[] }>(err)) {
        const mensaje = err.response?.data?.message;

        setError(
          Array.isArray(mensaje)
            ? mensaje.join('. ')
            : (mensaje ?? 'No se pudo asignar el agente.'),
        );
      } else {
        setError('Ocurrió un error al asignar el agente.');
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="asignar-agente-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="asignar-agente-title"
              className="text-xl font-semibold text-slate-900"
            >
              {ticket.agenteId ? 'Reasignar agente' : 'Asignar agente'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Selecciona al responsable de atender este ticket.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            aria-label="Cerrar"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Ticket #{ticket.id}</p>
          <p className="mt-1 font-semibold text-slate-900">{ticket.titulo}</p>
          <p className="mt-1 text-sm text-slate-500">
            Agente actual: {ticket.agente?.nombre ?? 'Sin asignar'}
          </p>
        </div>

        <form onSubmit={asignar} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="agenteId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Agente de soporte
            </label>

            <select
              id="agenteId"
              value={agenteId}
              onChange={(e) =>
                setAgenteId(e.target.value === '' ? '' : Number(e.target.value))
              }
              disabled={guardando}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500"
            >
              <option value="">Selecciona un agente</option>

              {agentes.map((agente) => (
                <option key={agente.id} value={agente.id}>
                  {agente.nombre} {agente.apellido}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                guardando || agenteId === '' || agenteId === ticket.agenteId
              }
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              <UserRoundCheck size={17} />
              {guardando ? 'Guardando...' : 'Guardar asignación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
