import { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import axios from 'axios';

import { categoriasService } from '../../../services/categorias.service';
import type { Categoria } from '../../../types/categoria';
import { useNotificationsStore } from '../../../store/useNotificationsStore';

interface EliminarCategoriaModalProps {
  categoria: Categoria;
  onClose: () => void;
  onDeleted: () => void | Promise<void>;
}

export function EliminarCategoriaModal({
  categoria,
  onClose,
  onDeleted,
}: EliminarCategoriaModalProps) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showToast = useNotificationsStore((state) => state.showToast);

  const eliminar = async () => {
    setEliminando(true);
    setError(null);

    try {
      await categoriasService.remove(categoria.id);
      showToast({
        kind: 'success',
        title: 'Categoría eliminada',
        message: `Se eliminó "${categoria.nombre}".`,
      });
      await onDeleted();
    } catch (err) {
      if (axios.isAxiosError<{ message?: string | string[] }>(err)) {
        const mensaje = err.response?.data?.message;

        setError(
          Array.isArray(mensaje)
            ? mensaje.join('. ')
            : (mensaje ?? 'No se pudo eliminar la categoría.'),
        );
      } else {
        setError('Ocurrió un error al eliminar.');
      }
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="eliminar-categoria-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="grid size-12 place-items-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={eliminando}
            aria-label="Cerrar"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <h2
          id="eliminar-categoria-title"
          className="mt-5 text-xl font-semibold text-slate-900"
        >
          Eliminar categoría
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          ¿Estás seguro de eliminar la categoría{' '}
          <strong>{categoria.nombre}</strong>? Esta acción no se puede deshacer.
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Si existen tickets asociados, el backend podría impedir su
          eliminación.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={eliminando}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={eliminar}
            disabled={eliminando}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 size={17} />
            {eliminando ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
