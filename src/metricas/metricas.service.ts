import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoTicket } from '../generated/prisma/enums.js';

@Injectable()
export class MetricasService {
    constructor(private readonly prisma: PrismaService) {}

    async getMetricas() {
        // 1. Obtener todas las categorías existentes en la DB
        const categorias = await this.prisma.categoria.findMany({
            select: { id: true, nombre: true },
            orderBy: { id: 'asc' },
        });

        // 2. Obtener todos los estados posibles desde el Enum
        const estados = Object.values(EstadoTicket);

        // 3. Agrupar por categoría (La DB hace el trabajo pesado)
        const porCategoriaRaw = await this.prisma.ticket.groupBy({
            by: ['categoriaId'],
            _count: { id: true },
        });

        // 4. Agrupar por estado
        const porEstadoRaw = await this.prisma.ticket.groupBy({
            by: ['estado'],
            _count: { id: true },
        });

        // 5. Mapear resultados para garantizar que los "ceros" aparezcan
        const ticketsPorCategoria = categorias.map((cat) => {
            const encontrada = porCategoriaRaw.find((p) => p.categoriaId === cat.id);
            return {
                categoria: cat.nombre,
                cantidad: encontrada ? encontrada._count.id : 0,
            };
        });

        const ticketsPorEstado = estados.map((estado) => {
            const encontrado = porEstadoRaw.find((p) => p.estado === estado);
            return {
                estado: estado,
                cantidad: encontrado ? encontrado._count.id : 0,
            };
        });

        return {
            totalTickets: porCategoriaRaw.reduce((acc, curr) => acc + curr._count.id, 0),
            porCategoria: ticketsPorCategoria,
            porEstado: ticketsPorEstado,
        };
    }
}