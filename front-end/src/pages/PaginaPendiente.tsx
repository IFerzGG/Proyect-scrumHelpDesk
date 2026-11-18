interface PaginaPendienteProps {
  titulo: string;
}

export default function PaginaPendiente({ titulo }: PaginaPendienteProps) {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-900">{titulo}</h1>

      <p className="mt-2 text-sm text-slate-500">
        Esta sección se encuentra en desarrollo.
      </p>
    </section>
  );
}
