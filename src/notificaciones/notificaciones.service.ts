import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificacionesGateway } from './notificaciones.gateway.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class NotificacionesService {
    private readonly logger = new Logger(NotificacionesService.name);

    constructor(
        private readonly gateway: NotificacionesGateway,
        private readonly prisma: PrismaService,
    ) {}

    @OnEvent('comentario.creado')
    async handleComentarioCreado(payload: any) {
        try {
            // Notificar al creador del ticket (si no fue él quien comentó)
            if (payload.autorId !== payload.creadorId) {
                this.gateway.server.to(`user:${payload.creadorId}`).emit('nuevoComentario', {
                    ticketId: payload.ticketId,
                    mensaje: `Hay un nuevo comentario en tu ticket #${payload.ticketId}`,
                });
            }
            // Notificar al agente asignado
            if (payload.agenteId && payload.autorId !== payload.agenteId) {
                this.gateway.server.to(`user:${payload.agenteId}`).emit('nuevoComentario', {
                    ticketId: payload.ticketId,
                    mensaje: `Nuevo comentario en el ticket #${payload.ticketId} asignado a ti`,
                });
            }
        } catch (error) {
            this.logger.error('Error al enviar notificación de comentario', error);
        }
    }

    @OnEvent('ticket.creado')
    async handleTicketCreado(payload: any) {
        try {
            if (payload.agenteId) {
                this.gateway.server.to(`user:${payload.agenteId}`).emit('nuevoTicket', {
                    ticketId: payload.ticketId,
                    mensaje: `Se te ha asignado un nuevo ticket #${payload.ticketId}`,
                });
            }
        } catch (error) {
            this.logger.error('Error al enviar notificación de ticket creado', error);
        }
    }

    @OnEvent('ticket.actualizado')
    async handleTicketActualizado(payload: any) {
        try {
            this.gateway.server.to(`user:${payload.creadorId}`).emit('ticketActualizado', {
                ticketId: payload.ticketId,
                mensaje: `El estado de tu ticket #${payload.ticketId} cambió a ${payload.nuevoEstado}`,
                nuevoEstado: payload.nuevoEstado,
            });
        } catch (error) {
            this.logger.error('Error al enviar notificación de ticket actualizado', error);
        }
    }
}