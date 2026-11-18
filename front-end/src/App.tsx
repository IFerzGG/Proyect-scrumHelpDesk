import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/layout/AppLayout';
import RutaProtegida from './auth/RutaProtegida';
import PaginaPendiente from './pages/PaginaPendiente';
import SinAccesoPage from './pages/SinAccesoPage';
import RutaPublica from './auth/RutaPublica';

import { TicketsListPage } from './pages/Tickets/ticketsList';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return sessionStorage.getItem('helpdesk-token') ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}


export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route element={<RutaPublica />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      {/* Rutas autenticadas */}
      <Route element={<RutaProtegida />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/sin-acceso" element={<SinAccesoPage />} />

          {/* ADMIN */}
          <Route element={<RutaProtegida rolesPermitidos={['ADMIN']} />}>
            <Route
              path="/tickets"
              element={<PaginaPendiente titulo="Solicitudes" />}
            />
            <Route
              path="/asignaciones"
              element={<PaginaPendiente titulo="Asignaciones" />}
            />
            <Route
              path="/agentes"
              element={<PaginaPendiente titulo="Agentes" />}
            />
          </Route>

          {/* AGENTE */}
          <Route element={<RutaProtegida rolesPermitidos={['AGENTE']} />}>
            <Route
              path="/mis-tickets"
              element={<PaginaPendiente titulo="Mis tickets" />}
            />
          </Route>

          {/* EMPLEADO */}
          <Route element={<RutaProtegida rolesPermitidos={['EMPLEADO']} />}>
            <Route
              path="/mis-solicitudes"
              element={<PaginaPendiente titulo="Mis solicitudes" />}
            />
            <Route
              path="/tickets/nuevo"
              element={<PaginaPendiente titulo="Nuevo ticket" />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
