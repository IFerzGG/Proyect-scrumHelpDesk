import {
  Ticket,
  Clock,
  LoaderCircle,
  CircleCheck,
  UserX,
  Users,
  RefreshCw,
} from 'lucide-react';

import StatCard from '../components/dashboard/StatCard';
import TicketStatusChart from '../components/dashboard/TicketStatusChart';
import RecentTickets from '../components/dashboard/RecentTickets';
import { useDashboard } from '../hooks/useDashboard';

import type { TicketReciente } from '../components/dashboard/RecentTickets';
import { useAuthStore } from '../store/useAuthStore';

export default function DashboardPage() {
  const usuario = useAuthStore((state) => state.usuario);
  // El hook debe ejecutarse dentro del componente.
  const {
    metricas,
    ticketsRecientes,
    metricasPorEstado,
    metricasPorCategoria,
    cargando,
    error,
    recargar,
  } = useDashboard();

  // Adaptamos los tickets de la API al componente existente.
  const tickets: TicketReciente[] = ticketsRecientes.map((ticket) => ({
    id: `#TK-${ticket.id}`,
    titulo: ticket.titulo,
    categoria: ticket.categoria?.nombre ?? 'Sin categoría',
    estado:
      ticket.estado === 'ENPROCESO'
        ? 'En proceso'
        : ticket.estado === 'ABIERTO'
          ? 'Abierto'
          : ticket.estado === 'RESUELTO'
            ? 'Resuelto'
            : 'Cerrado',
  }));

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-teal-700">
            {new Intl.DateTimeFormat('es-MX', {
              dateStyle: 'full',
            }).format(new Date())}
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Resumen general
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Aquí tienes lo que sucede con el soporte de tu equipo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void recargar()}
          disabled={cargando}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          {cargando ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          titulo="Total de tickets"
          valor={metricas.totalTickets}
          descripcion="Tickets registrados"
          icono={Ticket}
        />

        <StatCard
          titulo="Tickets abiertos"
          valor={metricas.abiertos}
          descripcion="Solicitudes pendientes de atención"
          icono={Clock}
        />

        <StatCard
          titulo="En proceso"
          valor={metricas.enProceso}
          descripcion="Tickets que están siendo atendidos"
          icono={LoaderCircle}
        />

        <StatCard
          titulo="Resueltos"
          valor={metricas.resueltos}
          descripcion="Solicitudes resueltas"
          icono={CircleCheck}
        />

        <StatCard
          titulo="Sin asignar"
          valor={metricas.sinAsignar}
          descripcion="Tickets pendientes de asignación"
          icono={UserX}
        />

        {usuario?.rol === 'ADMIN' && (
          <StatCard
            titulo="Agentes"
            valor={metricas.totalAgentes}
            descripcion="Agentes de soporte registrados"
            icono={Users}
          />
        )}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <TicketStatusChart
          estados={metricasPorEstado}
          categorias={metricasPorCategoria}
        />
        <RecentTickets tickets={tickets} />
      </section>
    </div>
  );
}
