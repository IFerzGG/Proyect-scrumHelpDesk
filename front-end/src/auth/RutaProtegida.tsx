import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '../store/useAuthStore';
import type { Rol } from '../types/auth';

interface RutaProtegidaProps {
  rolesPermitidos?: Rol[];
}

export default function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);
  const location = useLocation();

  // No hay sesión
  if (!token || !usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Usuario sin permisos
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/sin-acceso" replace />;
  }

  // Usuario autorizado
  return <Outlet />;
}
