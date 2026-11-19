import { useEffect, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import axios from 'axios';

import { comentariosService } from '../../services/comentarios';
import { useAuthStore } from '../../store/useAuthStore';

import type { Comentario } from '../../types/comentario';

interface ComentariosTicketProps {
  ticketId: number;
}

export default function ComentariosTicket({
  ticketId,
}: ComentariosTicketProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usuario = useAuthStore((state) => state.usuario);

  useEffect(() => {
    let activo = true;

    async function cargarComentarios() {
      setLoading(true);
      setError(null);
      setComentarios([]);

      try {
        const data = await comentariosService.getByTicket(ticketId);

        if (activo) {
          setComentarios(data);
        }
      } catch {
        if (activo) {
          setError('No se pudieron cargar los comentarios.');
        }
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargarComentarios();

    return () => {
      activo = false;
    };
  }, [ticketId]);

  const enviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();

    const contenido = mensaje.trim();

    if (!contenido || enviando) return;

    setEnviando(true);
    setError(null);

    try {
      await comentariosService.create(ticketId, {
        comentario: contenido,
      });

      const actualizados = await comentariosService.getByTicket(ticketId);

      setComentarios(actualizados);
      setMensaje('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          setError('No tienes permiso para comentar en este ticket.');
        } else {
          setError('No se pudo enviar el comentario.');
        }
      } else {
        setError('Ocurrió un error al enviar el comentario.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
          <MessageSquare size={20} />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">Comentarios</h2>
          <p className="text-xs text-slate-500">
            Historial de conversación del ticket
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">Cargando comentarios...</p>
        ) : comentarios.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            Todavía no hay comentarios en este ticket.
          </p>
        ) : (
          comentarios.map((comentario) => {
            const esPropio = comentario.usuarioId === usuario?.id;

            return (
              <div
                key={comentario.id}
                className={`flex ${esPropio ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    esPropio
                      ? 'bg-teal-50 text-teal-950'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold">
                      {comentario.usuario.nombre} {comentario.usuario.apellido}
                    </span>

                    <span className="text-[10px] text-slate-500">
                      {comentario.usuario.role}
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap break-words text-sm">
                    {comentario.comentario}
                  </p>

                  <p className="mt-2 text-right text-[10px] text-slate-400">
                    {new Date(comentario.creado).toLocaleString('es-MX')}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <form
        onSubmit={enviarComentario}
        className="mt-6 border-t border-slate-100 pt-5"
      >
        <label
          htmlFor="nuevo-comentario"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Añadir comentario
        </label>

        <textarea
          id="nuevo-comentario"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe un comentario..."
          rows={3}
          disabled={enviando || loading}
          className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:opacity-60"
        />

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!mensaje.trim() || enviando || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
            {enviando ? 'Enviando...' : 'Enviar comentario'}
          </button>
        </div>
      </form>
    </section>
  );
}
