import type { LucideIcon } from 'lucide-react';

type ColorStat = 'teal' | 'amber' | 'blue' | 'green';

interface StatCardProps {
  titulo: string;
  valor: string | number;
  descripcion: string;
  icono: LucideIcon;
  color?: ColorStat;
}

const colores: Record<ColorStat, string> = {
  teal: 'bg-teal-50 text-teal-700',
  amber: 'bg-amber-50 text-amber-700',
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-emerald-50 text-emerald-700',
};

export default function StatCard({
  titulo,
  valor,
  descripcion,
  icono: Icono,
  color = 'teal',
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-500">{titulo}</p>

        <span
          className={`grid size-9 place-items-center rounded-xl ${colores[color]}`}
        >
          <Icono size={18} />
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <p className="text-3xl font-semibold tracking-tight">{valor}</p>

        <p className="pb-1 text-xs text-slate-400">{descripcion}</p>
      </div>
    </article>
  );
}
