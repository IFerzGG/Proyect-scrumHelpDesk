import { create } from 'zustand';

export type RealtimeEvent =
  | 'nuevoComentario'
  | 'nuevoTicket'
  | 'ticketActualizado';

export type SocketStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export type ToastKind = 'success' | 'info' | 'error';

export interface RealtimeNotification {
  id: string;
  event: RealtimeEvent;
  ticketId: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ToastMessage {
  id: string;
  kind: ToastKind;
  title: string;
  message: string;
}

interface NotificationPayload {
  ticketId: number;
  mensaje: string;
}

interface NotificationsState {
  socketStatus: SocketStatus;
  notifications: RealtimeNotification[];
  toasts: ToastMessage[];
  setSocketStatus: (status: SocketStatus) => void;
  receiveNotification: (
    event: RealtimeEvent,
    payload: NotificationPayload,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

let nextMessageId = 0;

function createMessageId() {
  nextMessageId += 1;
  return `${Date.now()}-${nextMessageId}`;
}

const eventTitles: Record<RealtimeEvent, string> = {
  nuevoComentario: 'Nuevo comentario',
  nuevoTicket: 'Nuevo ticket',
  ticketActualizado: 'Ticket actualizado',
};

export const useNotificationsStore = create<NotificationsState>((set) => ({
  socketStatus: 'disconnected',
  notifications: [],
  toasts: [],

  setSocketStatus: (socketStatus) => set({ socketStatus }),

  receiveNotification: (event, payload) => {
    const id = createMessageId();
    const notification: RealtimeNotification = {
      id,
      event,
      ticketId: payload.ticketId,
      title: eventTitles[event],
      message: payload.mensaje,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const toast: ToastMessage = {
      id,
      kind: 'info',
      title: notification.title,
      message: notification.message,
    };

    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50),
      toasts: [toast, ...state.toasts].slice(0, 4),
    }));
  },

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification,
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),

  clearNotifications: () => set({ notifications: [], toasts: [] }),

  showToast: (toast) =>
    set((state) => ({
      toasts: [{ ...toast, id: createMessageId() }, ...state.toasts].slice(
        0,
        4,
      ),
    })),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
