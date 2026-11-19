import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function SinAccesoPage() {
  const rol = useAuthStore((state) => state.usuario?.rol);
  const rutaInicio =
    rol === 'EMPLEADO' ? '/mis-solicitudes' : '/dashboard';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <ShieldAlert size={48} className="text-amber-500" />

      <h1 className="mt-4 text-2xl font-semibold">Acceso denegado</h1>

      <p className="mt-2 text-slate-500">
        No tienes permisos para acceder a esta sección.
      </p>

      <Link
        to={rutaInicio}
        className="mt-6 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
      >
        Volver a mi espacio de trabajo
      </Link>
    </div>
  );
}
