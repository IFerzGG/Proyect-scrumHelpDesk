import { useState } from 'react';
import { ticketService } from '../../services/tickect.service';
import {
  EMPLEADO_TRANSITIONS,
  type EstadoTicket,
  type Ticket,
} from '../../types/ticket';
import { useNotificationsStore } from '../../store/useNotificationsStore';
import { useAuthStore } from '../../store/useAuthStore';

const transitionsByRole = {
  ADMIN: {
    ABIERTO: ['ENPROCESO', 'CERRADO'],
    ENPROCESO: ['RESUELTO', 'CERRADO'],
    RESUELTO: ['CERRADO'],
    CERRADO: [],
  },
  AGENTE: {
    ABIERTO: ['ENPROCESO', 'CERRADO'],
    ENPROCESO: ['RESUELTO'],
    RESUELTO: ['ENPROCESO', 'CERRADO'],
    CERRADO: [],
  },
  EMPLEADO: EMPLEADO_TRANSITIONS,
} satisfies Record<
  'ADMIN' | 'AGENTE' | 'EMPLEADO',
  Record<EstadoTicket, EstadoTicket[]>
>;

interface Props {
  ticket: Ticket;
  onClose: () => void;
  onUpdated: (t: Ticket) => void;
}

export function UpdateEstadoModal({ ticket, onClose, onUpdated }: Props) {
  const showToast = useNotificationsStore((state) => state.showToast);
  const rol = useAuthStore((state) => state.usuario?.rol) ?? 'EMPLEADO';
  const opciones = transitionsByRole[rol][ticket.estado];
  const [selected, setSelected] = useState<EstadoTicket | ''>(
    opciones[0] ?? '',
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (opciones.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4">
          <p className="text-slate-700">
            El ticket está en estado <strong>{ticket.estado}</strong> y no puedes
            cambiarlo desde tu rol.
          </p>
          <button onClick={onClose} className="w-full py-2 bg-slate-100 rounded">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await ticketService.update(ticket.id, { estado: selected });
      showToast({
        kind: 'success',
        title: 'Estado actualizado',
        message: `El ticket #${ticket.id} ahora está ${selected}.`,
      });
      onUpdated(updated);
    } catch {
      setError('No se pudo actualizar el estado.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4">
        <h3 className="font-bold text-lg">Cambiar estado</h3>
        <p className="text-sm text-slate-600">
          Estado actual: <strong>{ticket.estado}</strong>
        </p>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as EstadoTicket)}
          className="w-full border rounded px-3 py-2"
        >
          {opciones.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded bg-slate-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={submitting || !selected}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {submitting ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}