import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Role } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificacionesGateway } from './notificaciones.gateway.js';

interface ComentarioCreadoPayload {
  ticketId: number;
  autorId: number;
  agenteId: number | null;
  creadorId: number;
}

interface TicketCreadoPayload {
  ticketId: number;
  creadorId: number;
  agenteId: number | null;
}

interface TicketActualizadoPayload {
  ticketId: number;
  creadorId: number;
  actorId: number;
  estadoAnterior: string;
  nuevoEstado?: string;
  agenteAnteriorId: number | null;
  agenteId: number | null;
}

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);

  constructor(
    private readonly gateway: NotificacionesGateway,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent('comentario.creado')
  async handleComentarioCreado(payload: ComentarioCreadoPayload) {
    try {
      const [adminIds, agentIds] = await Promise.all([
        this.userIdsForRoles([Role.ADMIN]),
        payload.agenteId
          ? Promise.resolve([payload.agenteId])
          : this.userIdsForRoles([Role.AGENTE]),
      ]);
      const recipients = new Set([
        payload.creadorId,
        ...adminIds,
        ...agentIds,
      ]);

      for (const userId of recipients) {
        if (userId === payload.autorId) continue;

        const mensaje =
          userId === payload.creadorId
            ? `Hay un nuevo comentario en tu ticket #${payload.ticketId}.`
            : userId === payload.agenteId
              ? `Nuevo comentario en el ticket #${payload.ticketId} asignado a ti.`
              : `Hay un nuevo comentario en el ticket #${payload.ticketId}.`;

        this.emitToUser(userId, 'nuevoComentario', payload.ticketId, mensaje);
      }
    } catch (error) {
      this.logger.error('Error al enviar notificación de comentario', error);
    }
  }

  @OnEvent('ticket.creado')
  async handleTicketCreado(payload: TicketCreadoPayload) {
    try {
      const [adminIds, agentIds] = await Promise.all([
        this.userIdsForRoles([Role.ADMIN]),
        payload.agenteId
          ? Promise.resolve([payload.agenteId])
          : this.userIdsForRoles([Role.AGENTE]),
      ]);
      const recipients = new Set([
        payload.creadorId,
        ...adminIds,
        ...agentIds,
      ]);

      for (const userId of recipients) {
        let mensaje = `Se creó un nuevo ticket #${payload.ticketId}.`;
        if (userId === payload.creadorId) {
          mensaje = `Tu ticket #${payload.ticketId} fue creado correctamente.`;
        } else if (userId === payload.agenteId) {
          mensaje = `Se te asignó el nuevo ticket #${payload.ticketId}.`;
        } else if (!payload.agenteId && agentIds.includes(userId)) {
          mensaje = `Nuevo ticket #${payload.ticketId} sin asignar, pendiente de atención.`;
        }

        this.emitToUser(userId, 'nuevoTicket', payload.ticketId, mensaje);
      }
    } catch (error) {
      this.logger.error('Error al enviar notificación de ticket creado', error);
    }
  }

  @OnEvent('ticket.actualizado')
  async handleTicketActualizado(payload: TicketActualizadoPayload) {
    try {
      const adminIds = await this.userIdsForRoles([Role.ADMIN]);
      const recipients = new Set([
        payload.creadorId,
        ...adminIds,
        ...(payload.agenteAnteriorId ? [payload.agenteAnteriorId] : []),
        ...(payload.agenteId ? [payload.agenteId] : []),
      ]);

      for (const userId of recipients) {
        if (userId === payload.actorId) continue;

        const cambios: string[] = [];
        if (
          payload.nuevoEstado &&
          payload.nuevoEstado !== payload.estadoAnterior
        ) {
          cambios.push(
            `el estado cambió de ${payload.estadoAnterior} a ${payload.nuevoEstado}`,
          );
        }
        if (payload.agenteAnteriorId !== payload.agenteId) {
          cambios.push('la asignación del agente cambió');
        }

        let mensaje = `El ticket #${payload.ticketId} se actualizó: ${cambios.join(' y ')}.`;
        if (
          payload.agenteAnteriorId !== payload.agenteId &&
          userId === payload.agenteId
        ) {
          mensaje = `Te asignaron el ticket #${payload.ticketId}.`;
        } else if (
          payload.agenteAnteriorId !== payload.agenteId &&
          userId === payload.agenteAnteriorId
        ) {
          mensaje = `El ticket #${payload.ticketId} fue reasignado a otro agente.`;
        }

        this.emitToUser(userId, 'ticketActualizado', payload.ticketId, mensaje);
      }
    } catch (error) {
      this.logger.error(
        'Error al enviar notificación de ticket actualizado',
        error,
      );
    }
  }

  private async userIdsForRoles(roles: Role[]): Promise<number[]> {
    const users = await this.prisma.user.findMany({
      where: { role: { in: roles } },
      select: { id: true },
    });
    return users.map((user) => user.id);
  }

  private emitToUser(
    userId: number,
    event: 'nuevoComentario' | 'nuevoTicket' | 'ticketActualizado',
    ticketId: number,
    mensaje: string,
  ) {
    this.gateway.server.to(`user:${userId}`).emit(event, { ticketId, mensaje });
  }
}
