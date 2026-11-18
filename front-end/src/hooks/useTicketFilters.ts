import { useMemo } from 'react';
import type { Ticket, EstadoTicket, Prioridad } from '../types/ticket';

export interface TicketFilter {
  search: string;
  estado: EstadoTicket | 'TODOS';
  prioridad: Prioridad | 'TODAS';
  categoriaId: number | 'TODAS';
}

export const EMPTY_FILTERS: TicketFilter = {
  search: '',
  estado: 'TODOS',
  prioridad: 'TODAS',
  categoriaId: 'TODAS',
};

export function useTicketFilters(tickets: Ticket[], filters: TicketFilter) {
  return useMemo(() => {
    if (!Array.isArray(tickets)) return []; 
    const term = filters.search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (filters.estado !== 'TODOS' && t.estado !== filters.estado)
        return false;
      if (filters.prioridad !== 'TODAS' && t.prioridad !== filters.prioridad)
        return false;
      if (
        filters.categoriaId !== 'TODAS' &&
        t.categoriaId !== filters.categoriaId
      )
        return false;
      if (term) {
        const haystack =
          `${t.titulo} ${t.descripcion ?? ''} #${t.id}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [tickets, filters]);
}
