import { api } from './api';
import type { EstadoTicket } from '../types/ticket';

export interface MetricasDashboard {
  totalTickets: number;
  porCategoria: { categoria: string; cantidad: number }[];
  porEstado: { estado: EstadoTicket; cantidad: number }[];
}

export const metricasService = {
  async getDashboard(): Promise<MetricasDashboard> {
    const { data } = await api.get<MetricasDashboard>('/metricas');
    return data;
  },
};
