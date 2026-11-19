import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save } from 'lucide-react';
import axios from 'axios';

import {
  categoriaSchema,
  type CategoriaFormValues,
} from '../../../schemas/categoriaSchema';
import { categoriasService } from '../../../services/categorias.service';
import type { Categoria } from '../../../types/categoria';
import { useNotificationsStore } from '../../../store/useNotificationsStore';

interface CategoriaFormModalProps {
  categoria: Categoria | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

export function CategoriaFormModal({
  categoria,
  onClose,
  onSaved,
}: CategoriaFormModalProps) {
  const [error, setError] = useState<string | null>(null);
  const showToast = useNotificationsStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaFormValues>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: categoria?.nombre ?? '',
      descripcion: categoria?.descripcion ?? '',
    },
  });

  const onSubmit = async (values: CategoriaFormValues) => {
    setError(null);

    const datos = {
      nombre: values.nombre.trim(),
      descripcion: values.descripcion?.trim() || undefined,
    };

    try {
      if (categoria) {
        await categoriasService.update(categoria.id, datos);
      } else {
        await categoriasService.create(datos);
      }

      showToast({
        kind: 'success',
        title: categoria ? 'Categoría actualizada' : 'Categoría creada',
        message: `La categoría "${datos.nombre}" se guardó correctamente.`,
      });
      await onSaved();
    } catch (err) {
      if (axios.isAxiosError<{ message?: string | string[] }>(err)) {
        const mensaje = err.response?.data?.message;

        setError(
          Array.isArray(mensaje)
            ? mensaje.join('. ')
            : (mensaje ?? 'No se pudo guardar la categoría.'),
        );
      } else {
        setError('Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="categoria-modal-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="categoria-modal-title"
              className="text-xl font-semibold text-slate-900"
            >
              {categoria ? 'Editar categoría' : 'Nueva categoría'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {categoria
                ? 'Modifica los datos de la categoría.'
                : 'Completa los datos para registrar una categoría.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cerrar modal"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div>
            <label
              htmlFor="categoria-nombre"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nombre *
            </label>

            <input
              id="categoria-nombre"
              type="text"
              placeholder="Ej. Hardware"
              {...register('nombre')}
              aria-invalid={Boolean(errors.nombre)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />

            {errors.nombre && (
              <p className="mt-1 text-xs text-red-600">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="categoria-descripcion"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Descripción
            </label>

            <textarea
              id="categoria-descripcion"
              rows={4}
              placeholder="Describe brevemente la categoría..."
              {...register('descripcion')}
              aria-invalid={Boolean(errors.descripcion)}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />

            {errors.descripcion && (
              <p className="mt-1 text-xs text-red-600">
                {errors.descripcion.message}
              </p>
            )}
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
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              <Save size={17} />
              {isSubmitting
                ? 'Guardando...'
                : categoria
                  ? 'Guardar cambios'
                  : 'Crear categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
