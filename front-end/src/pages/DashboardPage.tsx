import { Tickets, Clock3, TrendingUp, CheckCircle2 } from 'lucide-react';

import StatCard from '../components/dashboard/StatCard';
import TicketActivityChart from '../components/dashboard/TicketActivityChart';
import RecentTickets from '../components/dashboard/RecentTickets';

import type { ActividadSemanal } from '../components/dashboard/TicketActivityChart';
import type { TicketReciente } from '../components/dashboard/RecentTickets';

// Datos temporales
const actividad: ActividadSemanal[] = [
  { day: 'Lun', nuevos: 14, resueltos: 10 },
  { day: 'Mar', nuevos: 19, resueltos: 15 },
  { day: 'Mié', nuevos: 12, resueltos: 17 },
  { day: 'Jue', nuevos: 24, resueltos: 18 },
  { day: 'Vie', nuevos: 17, resueltos: 21 },
  { day: 'Sáb', nuevos: 8, resueltos: 9 },
  { day: 'Dom', nuevos: 6, resueltos: 7 },
];

const tickets: TicketReciente[] = [
  {
    id: '#TK-1048',
    titulo: 'No puedo acceder al sistema',
    categoria: 'Acceso',
    estado: 'En proceso',
  },
  {
    id: '#TK-1047',
    titulo: 'Monitor con pantalla intermitente',
    categoria: 'Hardware',
    estado: 'Abierto',
  },
  {
    id: '#TK-1046',
    titulo: 'Solicitud de acceso a carpeta',
    categoria: 'Permisos',
    estado: 'Resuelto',
  },
];

export default function DashboardPage() {
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

        <span className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
          Datos de demostración
        </span>
      </div>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          titulo="Solicitudes totales"
          valor={128}
          descripcion="+12%"
          icono={Tickets}
          color="teal"
        />

        <StatCard
          titulo="Pendientes"
          valor={24}
          descripcion="8 requieren atención"
          icono={Clock3}
          color="amber"
        />

        <StatCard
          titulo="En proceso"
          valor={18}
          descripcion="En seguimiento"
          icono={TrendingUp}
          color="blue"
        />

        <StatCard
          titulo="Resueltas"
          valor={86}
          descripcion="+8 esta semana"
          icono={CheckCircle2}
          color="green"
        />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <TicketActivityChart datos={actividad} />
        <RecentTickets tickets={tickets} />
      </section>
    </div>
  );
}
