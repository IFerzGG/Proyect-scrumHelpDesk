import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const weeklyTickets = [
  { day: 'Lun', nuevos: 14, resueltos: 10 },
  { day: 'Mar', nuevos: 19, resueltos: 15 },
  { day: 'Mié', nuevos: 12, resueltos: 17 },
  { day: 'Jue', nuevos: 24, resueltos: 18 },
  { day: 'Vie', nuevos: 17, resueltos: 21 },
  { day: 'Sáb', nuevos: 8, resueltos: 9 },
  { day: 'Dom', nuevos: 6, resueltos: 7 },
];

const tickets = [
  { id: '#TK-1048', title: 'No puedo acceder al sistema', category: 'Acceso', status: 'En proceso', tone: 'amber' },
  { id: '#TK-1047', title: 'Monitor con pantalla intermitente', category: 'Hardware', status: 'Abierto', tone: 'blue' },
  { id: '#TK-1046', title: 'Solicitud de acceso a carpeta', category: 'Permisos', status: 'Resuelto', tone: 'green' },
  { id: '#TK-1045', title: 'Error al actualizar la aplicación', category: 'Software', status: 'En proceso', tone: 'amber' },
];

const stats = [
  { label: 'Solicitudes totales', value: '128', change: '+12%', icon: '▤', color: 'teal' },
  { label: 'Pendientes', value: '24', change: '8 requieren atención', icon: '◷', color: 'amber' },
  { label: 'En proceso', value: '18', change: 'En seguimiento', icon: '↗', color: 'blue' },
  { label: 'Resueltas', value: '86', change: '+8 esta semana', icon: '✓', color: 'green' },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem('helpdesk-token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="grid size-9 place-items-center rounded-xl bg-teal-600 text-white">
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
              <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">helpdesk</span>
        </div>

        <div className="mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Espacio de trabajo
        </div>
        <nav className="mt-3 space-y-1">
          <div className="flex items-center gap-3 rounded-xl bg-teal-50 px-3 py-2.5 text-sm font-semibold text-teal-800">
            <span aria-hidden="true">▦</span>
            Resumen
          </div>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500">
            <span aria-hidden="true">▤</span>
            Solicitudes
          </div>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500">
            <span aria-hidden="true">◉</span>
            Categorías
          </div>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500">
            <span aria-hidden="true">◷</span>
            Actividad
          </div>
        </nav>

        <div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white">
          <div className="grid size-9 place-items-center rounded-xl bg-white/10 text-teal-300">?</div>
          <p className="mt-3 text-sm font-semibold">¿Necesitas ayuda?</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Tu equipo de soporte está aquí para ti.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-[5] flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-teal-600 text-sm font-bold text-white lg:hidden">
              H
            </div>
            <span className="text-sm font-medium text-slate-500">Espacio de trabajo</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-slate-900">Resumen</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:block">Hola, bienvenido</span>
            <div className="grid size-9 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
              HD
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Salir
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-teal-700">Martes, 17 de noviembre</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Resumen general</h1>
              <p className="mt-1 text-sm text-slate-500">
                Aquí tienes lo que sucede con el soporte de tu equipo.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500">
              <span className="size-2 rounded-full bg-teal-500" />
              Datos de demostración
            </span>
          </div>

          <section aria-label="Indicadores" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <span className={`grid size-9 place-items-center rounded-xl text-sm font-semibold ${stat.color === 'teal' ? 'bg-teal-50 text-teal-700' : stat.color === 'amber' ? 'bg-amber-50 text-amber-700' : stat.color === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {stat.icon}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                  <p className="pb-1 text-xs text-slate-400">{stat.change}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">Actividad de solicitudes</h2>
                  <p className="mt-1 text-xs text-slate-400">Solicitudes creadas y resueltas esta semana</p>
                </div>
                <span className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500">
                  Esta semana
                </span>
              </div>
              <div className="mt-5 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTickets} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#eef2f6" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 12 }}
                      labelStyle={{ color: '#334155', fontWeight: 600 }}
                    />
                    <Line type="monotone" dataKey="nuevos" name="Nuevos" stroke="#0f9f8f" strokeWidth={2.5} dot={{ r: 3, fill: '#0f9f8f' }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="resueltos" name="Resueltos" stroke="#818cf8" strokeWidth={2.5} dot={{ r: 3, fill: '#818cf8' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex gap-5 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-teal-600" />Nuevos</span>
                <span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-indigo-400" />Resueltos</span>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">Solicitudes recientes</h2>
                  <p className="mt-1 text-xs text-slate-400">Últimos movimientos del equipo</p>
                </div>
                <span className="grid size-8 place-items-center rounded-lg bg-slate-50 text-slate-500">↗</span>
              </div>
              <div className="mt-4 divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center gap-3 py-3.5">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-xs font-semibold text-slate-500">
                      {ticket.title.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{ticket.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{ticket.id} · {ticket.category}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${ticket.tone === 'amber' ? 'bg-amber-50 text-amber-700' : ticket.tone === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-5 py-4 text-xs leading-5 text-slate-500">
            Esta vista usa contenido estático para mostrar el diseño. La conexión de métricas,
            solicitudes y perfil queda pendiente para la siguiente etapa.
          </div>
        </main>
      </div>
    </div>
  );
}
