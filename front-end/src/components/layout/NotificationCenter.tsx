import { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useNotificationsStore } from '../../store/useNotificationsStore';
import { useAuthStore } from '../../store/useAuthStore';

const socketStatusLabels = {
  connecting: 'Conectando',
  connected: 'Conectado',
  disconnected: 'Desconectado',
  error: 'Sin conexión',
} as const;

export default function NotificationCenter() {
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();
  const rol = useAuthStore((state) => state.usuario?.rol);
  const socketStatus = useNotificationsStore((state) => state.socketStatus);
  const notifications = useNotificationsStore(
    (state) => state.notifications,
  );
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationsStore(
    (state) => state.markAllAsRead,
  );

  const noLeidas = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto((open) => !open)}
        aria-label={
          noLeidas
            ? `Notificaciones, ${noLeidas} sin leer`
            : 'Notificaciones'
        }
        aria-expanded={abierto}
        className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
      >
        <Bell size={19} />
        <span
          className={`absolute right-2 top-2 size-2 rounded-full ring-2 ring-white ${
            socketStatus === 'connected'
              ? 'bg-emerald-500'
              : socketStatus === 'error'
                ? 'bg-red-500'
                : 'bg-amber-400'
          }`}
        />
        {noLeidas > 0 && (
          <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-label="Notificaciones"
          className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Notificaciones
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                <span
                  className={`size-1.5 rounded-full ${
                    socketStatus === 'connected'
                      ? 'bg-emerald-500'
                      : socketStatus === 'error'
                        ? 'bg-red-500'
                        : 'bg-amber-400'
                  }`}
                />
                Tiempo real: {socketStatusLabels[socketStatus]}
              </p>
            </div>
            {noLeidas > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-teal-700 hover:bg-teal-50"
              >
                <CheckCheck size={14} />
                Marcar leídas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Bell className="mx-auto size-6 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  Aún no tienes notificaciones
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Aquí aparecerán las novedades de tus tickets.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => {
                    markAsRead(notification.id);
                    setAbierto(false);
                    navigate(
                      rol === 'EMPLEADO'
                        ? `/mis-solicitudes/${notification.ticketId}`
                        : `/tickets/${notification.ticketId}`,
                    );
                  }}
                  className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                    notification.read ? 'bg-white' : 'bg-teal-50/60'
                  }`}
                >
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${
                      notification.read ? 'bg-slate-200' : 'bg-teal-500'
                    }`}
                  >
                    <span className="sr-only">
                      {notification.read ? 'Leída' : 'Sin leer'}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-800">
                        {notification.title}
                      </span>
                      <time
                        dateTime={notification.createdAt}
                        className="shrink-0 text-[10px] text-slate-400"
                      >
                        {new Date(notification.createdAt).toLocaleTimeString(
                          'es-MX',
                          { hour: '2-digit', minute: '2-digit' },
                        )}
                      </time>
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-600">
                      {notification.message}
                    </span>
                    <span className="mt-1 block text-[10px] font-medium text-slate-400">
                      Ticket #{notification.ticketId}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
