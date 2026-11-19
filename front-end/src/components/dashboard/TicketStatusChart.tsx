import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { MetricasDashboard } from '../../services/metricas.service';

const stateLabels: Record<string, string> = {
  ABIERTO: 'Abierto',
  ENPROCESO: 'En proceso',
  RESUELTO: 'Resuelto',
  CERRADO: 'Cerrado',
};

interface TicketStatusChartProps {
  estados: MetricasDashboard['porEstado'];
  categorias: MetricasDashboard['porCategoria'];
}

export default function TicketStatusChart({
  estados,
  categorias,
}: TicketStatusChartProps) {
  const [mostrar, setMostrar] = useState<'estado' | 'categoria'>('estado');
  const chartData =
    mostrar === 'estado'
      ? estados.map((item) => ({
          nombre: stateLabels[item.estado],
          cantidad: item.cantidad,
        }))
      : categorias.map((item) => ({
          nombre: item.categoria,
          cantidad: item.cantidad,
        }));

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Resumen de tickets</h2>
          <p className="mt-1 text-xs text-slate-400">
            Distribución actual de las solicitudes
          </p>
        </div>
        <div
          role="group"
          aria-label="Agrupar métricas por"
          className="flex rounded-lg bg-slate-100 p-1"
        >
          <button
            type="button"
            aria-pressed={mostrar === 'estado'}
            onClick={() => setMostrar('estado')}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
              mostrar === 'estado'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Estado
          </button>
          <button
            type="button"
            aria-pressed={mostrar === 'categoria'}
            onClick={() => setMostrar('categoria')}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
              mostrar === 'categoria'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Categoría
          </button>
        </div>
      </div>

      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 4, bottom: 0 }}
          >
            <CartesianGrid stroke="#eef2f6" vertical={false} />
            <YAxis
              type="category"
              dataKey="nombre"
              axisLine={false}
              tickLine={false}
              width={100}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <XAxis
              type="number"
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }}
            />
            <Bar
              dataKey="cantidad"
              name="Tickets"
              fill="#0f9f8f"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
