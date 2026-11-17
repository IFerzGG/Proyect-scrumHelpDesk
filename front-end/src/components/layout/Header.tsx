import { Menu, LogOut, UserRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../store/useAuthStore';
import { opcionesNavegacion } from '../../config/navegacion';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const usuario = useAuthStore((state) => state.usuario);
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion);

  const opcionActual = opcionesNavegacion.find(
    (opcion) => opcion.ruta === location.pathname,
  );

  const titulo = opcionActual?.nombre ?? 'Espacio de trabajo';

  const logout = () => {
    cerrarSesion();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <span className="hidden text-sm font-medium text-slate-500 sm:block">
          Espacio de trabajo
        </span>

        <span className="hidden text-slate-300 sm:block">/</span>

        <span className="text-sm font-semibold text-slate-900">{titulo}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-800">
            {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario'}
          </p>
          <p className="text-xs capitalize text-slate-400">
            {usuario?.rol?.toLowerCase()}
          </p>
        </div>

        <div className="grid size-9 place-items-center rounded-full bg-teal-100 text-teal-800">
          <UserRound size={18} />
        </div>

        <button
          type="button"
          onClick={logout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-600"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}
