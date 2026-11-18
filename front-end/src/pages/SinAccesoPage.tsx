import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function SinAccesoPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <ShieldAlert size={48} className="text-amber-500" />

      <h1 className="mt-4 text-2xl font-semibold">Acceso denegado</h1>

      <p className="mt-2 text-slate-500">
        No tienes permisos para acceder a esta sección.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
      >
        Volver al dashboard
      </Link>
    </div>
  );
}
