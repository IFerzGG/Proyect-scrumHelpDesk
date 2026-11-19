import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { useAuthStore } from '../store/useAuthStore';
import { useNotificationsStore } from '../store/useNotificationsStore';

interface SocketNotificationPayload {
  ticketId?: unknown;
  mensaje?: unknown;
}

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function useRealtimeNotifications() {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const setSocketStatus = useNotificationsStore.getState().setSocketStatus;

    if (!token) {
      setSocketStatus('disconnected');
      return;
    }

    const socket = io(apiUrl, {
      auth: { token },
      autoConnect: false,
    });

    const handleNotification =
      (event: 'nuevoComentario' | 'nuevoTicket' | 'ticketActualizado') =>
      (payload: SocketNotificationPayload) => {
        if (
          typeof payload?.ticketId !== 'number' ||
          typeof payload.mensaje !== 'string'
        ) {
          return;
        }

        useNotificationsStore
          .getState()
          .receiveNotification(event, {
            ticketId: payload.ticketId,
            mensaje: payload.mensaje,
          });
      };

    setSocketStatus('connecting');
    socket.on('connect', () => setSocketStatus('connected'));
    socket.on('disconnect', () => setSocketStatus('disconnected'));
    socket.on('connect_error', () => setSocketStatus('error'));
    socket.on('nuevoComentario', handleNotification('nuevoComentario'));
    socket.on('nuevoTicket', handleNotification('nuevoTicket'));
    socket.on('ticketActualizado', handleNotification('ticketActualizado'));
    socket.connect();

    return () => {
      socket.disconnect();
      setSocketStatus('disconnected');
    };
  }, [token]);
}
