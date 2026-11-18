import { api } from '../libs/axios';

import type { Ticket, CreateTicketPay, UpdateTicket } from '../types/ticket';

export const ticketService = {
  list: async (): Promise<Ticket[]> => {
    const { data } = await api.get<Ticket[]>('/ticket');
    return data;
  },
  getByid: async (id: number): Promise<Ticket> => {
    const { data } = await api.get<Ticket>(`/ticket/${id}`);
    return data;
  },
  create: async (dto: CreateTicketPay): Promise<Ticket> => {
    const { data } = await api.post<Ticket>('/ticket', dto);
    return data;
  },
  update: async (id: number, dto: UpdateTicket): Promise<Ticket> => {
    const {data} = await api.patch<Ticket>(`/ticket/${id}`, dto)
    return data
  }
};
