import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/layout/AppLayout';
import RutaProtegida from './auth/RutaProtegida';
import { useAuthStore } from './store/useAuthStore';
import AgentTicketsPage from './pages/AgentTicketsPage';
import NuevoTicketPage from './pages/NuevoTicketPage';
import SinAccesoPage from './pages/SinAccesoPage';
import RutaPublica from './auth/RutaPublica';
import CategoriasPage from './pages/CategoriasPage';
import AgentesPage from './pages/AgentesPage';
import TodosTicketsPage from './pages/TodosTicketsPage';
import { TicketsListPage } from './pages/Tickets/ticketsList';
import { TicketDetailPage } from './pages/Tickets/ticketDetail';
import AsignacionesPage from './pages/AsignacionesPage';

function HomeRedirect() {
  const rol = useAuthStore((state) => state.usuario?.rol);
  return (
    <Navigate
      to={rol === 'EMPLEADO' ? '/mis-solicitudes' : '/dashboard'}
      replace
    />
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
          <Route
            element={
              <RutaProtegida rolesPermitidos={['ADMIN', 'AGENTE']} />
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tickets" element={<TodosTicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
          </Route>
          <Route
            element={<RutaProtegida rolesPermitidos={['ADMIN', 'AGENTE']} />}
          >
            <Route path="/categorias" element={<CategoriasPage />} />
          </Route>
          <Route path="/sin-acceso" element={<SinAccesoPage />} />

          {/* ADMIN */}
          <Route element={<RutaProtegida rolesPermitidos={['ADMIN']} />}>
            <Route path="/agentes" element={<AgentesPage />} />
            <Route path="/asignaciones" element={<AsignacionesPage />} />
          </Route>

          {/* AGENTE */}
          <Route element={<RutaProtegida rolesPermitidos={['AGENTE']} />}>
            <Route path="/mis-tickets" element={<AgentTicketsPage />} />
          </Route>

          {/* EMPLEADO */}
          <Route element={<RutaProtegida rolesPermitidos={['EMPLEADO']} />}>
            <Route path="/mis-solicitudes" element={<TicketsListPage />} />
            <Route path="/mis-solicitudes/:id" element={<TicketDetailPage />} />
            <Route path="/tickets/nuevo" element={<NuevoTicketPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
