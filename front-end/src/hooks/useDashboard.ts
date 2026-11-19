import { useCallback, useEffect, useMemo, useState } from 'react';

import { ticketService } from '../services/tickect.service';
import { usuariosService } from '../services/usuarios';
import type { Ticket } from '../types/ticket';
import { calcularActividadSemanal } from '../services/actividadTickets';

export function useDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalAgentes, setTotalAgentes] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const [ticketsData, agentesData] = await Promise.all([
        ticketService.list(),
        usuariosService.getAgentes(),
      ]);

      setTickets(ticketsData);
      setTotalAgentes(agentesData.length);
    } catch {
      setError('No fue posible cargar las estadísticas.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const metricas = useMemo(() => {
    return {
      totalTickets: tickets.length,

      abiertos: tickets.filter((ticket) => ticket.estado === 'ABIERTO').length,

      enProceso: tickets.filter((ticket) => ticket.estado === 'ENPROCESO')
        .length,

      resueltos: tickets.filter((ticket) => ticket.estado === 'RESUELTO')
        .length,

      cerrados: tickets.filter((ticket) => ticket.estado === 'CERRADO').length,

      sinAsignar: tickets.filter((ticket) => ticket.agenteId == null).length,

      asignados: tickets.filter((ticket) => ticket.agenteId != null).length,

      totalAgentes,
    };
  }, [tickets, totalAgentes]);

  const ticketsRecientes = useMemo(() => {
    return [...tickets]
      .sort(
        (a, b) => new Date(b.creado).getTime() - new Date(a.creado).getTime(),
      )
      .slice(0, 5);
  }, [tickets]);

  const actividadSemanal = useMemo(
    () => calcularActividadSemanal(tickets),
    [tickets],
  );

  return {
    metricas,
    ticketsRecientes,
    actividadSemanal,
    cargando,
    error,
    recargar: cargarDatos,
  };
}
