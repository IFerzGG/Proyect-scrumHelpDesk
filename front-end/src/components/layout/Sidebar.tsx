import { NavLink } from 'react-router-dom';
import { Check, HelpCircle, X } from 'lucide-react';

import { opcionesNavegacion } from '../../config/navegacion';
import { useAuthStore } from '../../store/useAuthStore';

interface SidebarProps {
  abierto: boolean;
  onCerrar: () => void;
}

export default function Sidebar({ abierto, onCerrar }: SidebarProps) {
  const rol = useAuthStore((state) => state.usuario?.rol);

  const opciones = opcionesNavegacion.filter(
    (opcion) => rol && opcion.roles.includes(rol),
  );

  return (
    <>
      {/* Fondo oscuro en móviles */}
      {abierto && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={onCerrar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-64
          flex-col border-r border-slate-200
          bg-white px-5 py-6 transition-transform
          duration-300 lg:translate-x-0
          ${abierto ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-teal-600 text-white">
              <Check size={20} strokeWidth={2.5} />
            </div>

            <span className="text-lg font-bold tracking-tight">helpdesk</span>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar menú"
            className="text-slate-500 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <div className="mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Espacio de trabajo
        </div>

        <nav className="mt-3 space-y-1">
          {opciones.map((opcion) => {
            const Icono = opcion.icono;

            return (
              <NavLink
                key={opcion.ruta}
                to={opcion.ruta}
                onClick={onCerrar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-teal-50 font-semibold text-teal-800'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icono size={18} />
                {opcion.nombre}
              </NavLink>
            );
          })}
        </nav>

        {/* Ayuda */}
        <div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white">
          <div className="grid size-9 place-items-center rounded-xl bg-white/10 text-teal-300">
            <HelpCircle size={20} />
          </div>

          <p className="mt-3 text-sm font-semibold">¿Necesitas ayuda?</p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Tu equipo de soporte está aquí para ti.
          </p>
        </div>
      </aside>
    </>
  );
}
