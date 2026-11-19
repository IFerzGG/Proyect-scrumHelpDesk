import {
  LayoutDashboard,
  Ticket,
  TicketPlus,
  Users,
  ClipboardList,
  FolderKanban,
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
    roles: ['ADMIN'],
  },
  {
    nombre: 'Solicitudes',
    ruta: '/tickets',
    icono: Ticket,
    roles: ['ADMIN'],
  },
  {
    nombre: 'Asignaciones',
    ruta: '/asignaciones',
    icono: FolderKanban,
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
