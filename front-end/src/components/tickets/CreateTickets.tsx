import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { ticketService } from '../../services/tickect.service';
import type { Categoria } from '../../types/categoria';
import type { Ticket } from '../../types/ticket';
import axios from 'axios';
import { useNotificationsStore } from '../../store/useNotificationsStore';

const schema = z.object({
  titulo: z.string().trim().min(3, 'Mínimo 3 caracteres'),
  descripcion: z.string().trim().optional(),
  prioridad: z.enum(['CRITICO', 'ALTA', 'MEDIA', 'BAJA']),
  categoriaId: z.number({ message: 'Selecciona una categoría' }).int().positive(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  categorias: Categoria[];
  onClose: () => void;
  onCreated: (t: Ticket) => void;
}

export function CreateTicketModal({ categorias, onClose, onCreated }: Props) {
  const showToast = useNotificationsStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { prioridad: 'MEDIA' },
  });
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const t = await ticketService.create({
        ...values,
        descripcion: values.descripcion || undefined,
      });
      showToast({
        kind: 'success',
        title: 'Ticket creado',
        message: `Tu solicitud #${t.id} se registró correctamente.`,
      });
      onCreated(t);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 400) {
        setServerError('Datos inválidos. Revisa el formulario.');
      } else if (axios.isAxiosError(e) && e.response?.status === 404) {
        setError('categoriaId', { message: 'Categoría inexistente' });
      } else {
        setServerError('Error al crear el ticket. Intenta de nuevo.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-bold">Nuevo ticket</h2>

        <div>
          <label className="text-sm font-medium">Título</label>
          <input
            {...register('titulo')}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej: No enciende la laptop"
          />
          {errors.titulo && (
            <p className="text-red-600 text-xs mt-1">{errors.titulo.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            {...register('descripcion')}
            rows={3}
            className="w-full border rounded px-3 py-2"
            placeholder="Describe el problema con detalle..."
          />
          {errors.descripcion && (
            <p className="text-red-600 text-xs mt-1">{errors.descripcion.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Prioridad</label>
            <select
              {...register('prioridad')}
              className="w-full border rounded px-3 py-2"
            >
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
              <option value="CRITICO">Crítico</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Categoría</label>
            <select
              {...register('categoriaId', { valueAsNumber: true })}
              className="w-full border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>
                Selecciona…
              </option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errors.categoriaId && (
              <p className="text-red-600 text-xs mt-1">
                {errors.categoriaId.message}
              </p>
            )}
          </div>
        </div>

        {serverError && (
          <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{serverError}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando…' : 'Crear ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}