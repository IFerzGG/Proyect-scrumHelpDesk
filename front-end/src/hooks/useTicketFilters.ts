import { useMemo } from 'react';
import type { Ticket, EstadoTicket, Prioridad } from '../types/ticket';

export interface TicketFilter {
  search: string;
  estado: EstadoTicket | 'TODAS';
  prioridad: Prioridad | 'TODOS';
  categoriaId: number | 'TODAS';
}

export const EMPTY_FILTERS: TicketFilter = {
  search: '',
  estado: 'TODAS',
  prioridad: 'TODOS',
  categoriaId: 'TODAS',
};

export function useTicketFilters(ticket: Ticket[], filters: TicketFilter) {
  return useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return ticket.filter((t) => {
      if (filters.estado !== 'TODAS' && t.estado !== filters.estado)
        return false;
      if (filters.prioridad !== 'TODOS' && t.prioridad !== filters.prioridad)
        return false;
      if (
        filters.categoriaId !== 'TODAS' &&
        t.categoriaId !== filters.categoriaId
      )
        return false;
        if(term) {
            const haystack = `${t.titulo} ${t.descripcion ?? ""} #${t.id}`.toLowerCase()
            if(!haystack.includes(term)) return false
        }
        return true
    });
  }, [ticket, filters]);
}
