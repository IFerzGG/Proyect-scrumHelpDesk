import { useEffect } from 'react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

import {
  useNotificationsStore,
  type ToastMessage,
} from '../../store/useNotificationsStore';

function ToastItem({ toast }: { toast: ToastMessage }) {
  const dismissToast = useNotificationsStore((state) => state.dismissToast);

  useEffect(() => {
    const timeout = window.setTimeout(() => dismissToast(toast.id), 5000);
    return () => window.clearTimeout(timeout);
  }, [dismissToast, toast.id]);

  const Icon =
    toast.kind === 'success'
      ? CheckCircle2
      : toast.kind === 'error'
        ? TriangleAlert
        : Info;
  const tone =
    toast.kind === 'success'
      ? 'border-emerald-200 text-emerald-700'
      : toast.kind === 'error'
        ? 'border-red-200 text-red-700'
        : 'border-blue-200 text-blue-700';

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg shadow-slate-900/10 ${tone}`}
    >
      <Icon size={19} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-600">
          {toast.message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        aria-label="Cerrar aviso"
        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <X size={15} />
      </button>
    </div>
  );
}

export default function ToastViewport() {
  const toasts = useNotificationsStore((state) => state.toasts);

  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed right-4 top-20 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
