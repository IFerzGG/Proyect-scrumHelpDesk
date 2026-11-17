import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface ActividadSemanal {
  day: string;
  nuevos: number;
  resueltos: number;
}

interface TicketActivityChartProps {
  datos: ActividadSemanal[];
}

export default function TicketActivityChart({
  datos,
}: TicketActivityChartProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-semibold">Actividad de solicitudes</h2>

      <p className="mt-1 text-xs text-slate-400">
        Solicitudes creadas y resueltas esta semana
      </p>

      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={datos}
            margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
          >
            <CartesianGrid stroke="#eef2f6" vertical={false} />

            <XAxis dataKey="day" axisLine={false} tickLine={false} />

            <YAxis axisLine={false} tickLine={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="nuevos"
              name="Nuevos"
              stroke="#0f9f8f"
              strokeWidth={2.5}
            />

            <Line
              type="monotone"
              dataKey="resueltos"
              name="Resueltos"
              stroke="#818cf8"
              strokeWidth={2.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
