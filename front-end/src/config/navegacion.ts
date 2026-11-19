import {
  LayoutDashboard,
  Ticket,
  TicketPlus,
  Users,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';
import { Tags } from 'lucide-react';
import type { Rol } from '../types/auth';

export interface OpcionNavegacion {
  nombre: string;
  ruta: string;
  icono: LucideIcon;
  roles: Rol[];
}

export const opcionesNavegacion: OpcionNavegacion[] = [
  {
    nombre: 'Categorías',
    ruta: '/categorias',
    icono: Tags,
    roles: ['ADMIN', 'AGENTE'],
  },
  {
    nombre: 'Resumen',
    ruta: '/dashboard',
    icono: LayoutDashboard,
    roles: ['ADMIN', 'AGENTE'],
  },
  {
    nombre: 'Solicitudes',
    ruta: '/tickets',
    icono: Ticket,
    roles: ['ADMIN', 'AGENTE'],
  },
  {
    nombre: 'Asignaciones',
    ruta: '/asignaciones',
    icono: ClipboardList,
    roles: ['ADMIN'],
  },
  {
    nombre: 'Agentes',
    ruta: '/agentes',
    icono: Users,
    roles: ['ADMIN'],
  },
  {
    nombre: 'Mis tickets',
    ruta: '/mis-tickets',
    icono: ClipboardList,
    roles: ['AGENTE'],
  },
  {
    nombre: 'Mis solicitudes',
    ruta: '/mis-solicitudes',
    icono: Ticket,
    roles: ['EMPLEADO'],
  },
  {
    nombre: 'Nuevo ticket',
    ruta: '/tickets/nuevo',
    icono: TicketPlus,
    roles: ['EMPLEADO'],
  },
];
