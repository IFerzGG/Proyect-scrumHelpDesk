import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function RutaPublica() {
  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);

  if (token && usuario) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
