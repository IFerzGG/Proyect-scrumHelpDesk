import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateComentarioDto } from './dto/create-comentario.dto.js';
import { Role } from '../generated/prisma/enums.js';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ComentariosService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async create(dto: CreateComentarioDto, ticketId: number, userId: number, userRole: Role) {
        // 1. Verificar que el ticket existe
        const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) {
            throw new NotFoundException(`No se encontró el ticket con id ${ticketId}`);
        }

        // 2. Regla de visibilidad: EMPLEADO solo puede comentar en sus propios tickets
        if (userRole === Role.EMPLEADO && ticket.usuarioId !== userId) {
            throw new BadRequestException('No tienes permiso para comentar en este ticket');
        }

        // 3. Crear el comentario (autor y fecha los pone Prisma/DB automáticamente)
        const nuevoComentario = await this.prisma.comentario.create({
            data: {
                comentario: dto.comentario,
                usuarioId: userId,
                ticketId: ticketId,
            },
            include: {
                usuario: {
                    select: { id: true, nombre: true, apellido: true, role: true } // Nunca exponemos password
                }
            }
        });

        // 4. Disparar evento para Notificaciones (Desacoplado)
        // Si esto falla, el comentario ya se guardó, cumpliendo el requisito de resiliencia.
        this.eventEmitter.emit('comentario.creado', {
            ticketId: ticketId,
            autorId: userId,
            agenteId: ticket.agenteId,
            creadorId: ticket.usuarioId,
            mensaje: dto.comentario
        });

        return nuevoComentario;
    }

    async findByTicket(ticketId: number, userId: number, userRole: Role) {
        // 1. Verificar que el ticket existe
        const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) {
            throw new NotFoundException(`No se encontró el ticket con id ${ticketId}`);
        }

        // 2. Regla de visibilidad: EMPLEADO solo puede ver comentarios de sus propios tickets
        if (userRole === Role.EMPLEADO && ticket.usuarioId !== userId) {
            throw new BadRequestException('No tienes permiso para ver los comentarios de este ticket');
        }

        // 3. Obtener historial en orden cronológico
        return this.prisma.comentario.findMany({
            where: { ticketId },
            orderBy: { creado: 'asc' },
            include: {
                usuario: {
                    select: { id: true, nombre: true, apellido: true, role: true }
                }
            }
        });
    }
}