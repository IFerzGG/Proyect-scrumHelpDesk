export type Rol = 'ADMIN' | 'AGENTE' | 'EMPLEADO';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
}
