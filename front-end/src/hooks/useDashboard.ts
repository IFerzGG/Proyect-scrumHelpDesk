import { useCallback, useEffect, useMemo, useState } from 'react';

import { ticketService } from '../services/tickect.service';
import { usuariosService } from '../services/usuarios';
import type { Ticket } from '../types/ticket';
import { useAuthStore } from '../store/useAuthStore';
import {
  metricasService,
  type MetricasDashboard,
} from '../services/metricas.service';

export function useDashboard() {
  const usuario = useAuthStore((state) => state.usuario);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [metricasApi, setMetricasApi] = useState<MetricasDashboard | null>(
    null,
  );
  const [totalAgentes, setTotalAgentes] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const [metricasResult, ticketsResult, agentesResult] =
        await Promise.allSettled([
        metricasService.getDashboard(),
        ticketService.list(),
        usuario?.rol === 'ADMIN'
          ? usuariosService.getAgentes()
          : Promise.resolve([]),
      ]);

      const errores: string[] = [];

      if (metricasResult.status === 'fulfilled') {
        setMetricasApi(metricasResult.value);
      } else {
        setMetricasApi(null);
        errores.push('No fue posible cargar las métricas.');
      }

      if (
        ticketsResult.status === 'fulfilled' &&
        Array.isArray(ticketsResult.value)
      ) {
        setTickets(ticketsResult.value);
      } else {
        setTickets([]);
        errores.push('No fue posible cargar los tickets recientes.');
      }

      if (agentesResult.status === 'fulfilled') {
        setTotalAgentes(agentesResult.value.length);
      } else if (usuario?.rol === 'ADMIN') {
        setTotalAgentes(0);
        errores.push('No fue posible cargar la cantidad de agentes.');
      } else {
        setTotalAgentes(0);
      }
      setError(errores.length ? errores.join(' ') : null);
    } finally {
      setCargando(false);
    }
  }, [usuario?.rol]);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const metricas = useMemo(() => {
    const cantidadEstado = (estado: string) =>
      metricasApi?.porEstado.find((item) => item.estado === estado)
        ?.cantidad ?? 0;

    return {
      totalTickets: metricasApi?.totalTickets ?? 0,
      abiertos: cantidadEstado('ABIERTO'),
      enProceso: cantidadEstado('ENPROCESO'),
      resueltos: cantidadEstado('RESUELTO'),
      cerrados: cantidadEstado('CERRADO'),

      sinAsignar: tickets.filter((ticket) => ticket.agenteId == null).length,

      asignados: tickets.filter((ticket) => ticket.agenteId != null).length,

      totalAgentes,
    };
  }, [metricasApi, tickets, totalAgentes]);

  const ticketsRecientes = useMemo(() => {
    return [...tickets]
      .sort(
        (a, b) => new Date(b.creado).getTime() - new Date(a.creado).getTime(),
      )
      .slice(0, 5);
  }, [tickets]);

  return {
    metricas,
    ticketsRecientes,
    metricasPorEstado: metricasApi?.porEstado ?? [],
    metricasPorCategoria: metricasApi?.porCategoria ?? [],
    cargando,
    error,
    recargar: cargarDatos,
  };
}
