import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTikectDto } from './dto/create-ticket.dto.js';
import { EstadoTicket, Role } from '../generated/prisma/enums.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}
  async finall(id: number) {
    const encontrado = await this.prisma.user.findUnique({
      where: { id: id },
    });
    const where =
      encontrado?.role === Role.EMPLEADO ? { usuarioId: encontrado.id } : {};
    return this.prisma.ticket.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            role: true,
          },
        },
        agente: {
          select: {
            id: true,
            nombre: true,
          },
        },
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }
  async findoneall(tikectid: number, id: number) {
    const tickect = await this.prisma.ticket.findUnique({
      where: { id: tikectid },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            role: true,
          },
        },
        agente: {
          select: {
            id: true,
            nombre: true,
          },
        },
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
    if (!tickect) {
      throw new NotFoundException(`no se encontro el tikect con id ${tikectid}}`);
    }
    const usuario = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (usuario?.role === Role.EMPLEADO && tickect.usuarioId !== usuario.id) {
      throw new BadRequestException(`solo puede acceder a tus tickets`);
    }
    return tickect;
  }

  //capturar erro si la base de datos no encuentra el id  de categoria
  async create(dto: CreateTikectDto, userid: number) {
    if (dto.agenteId) {
      await this.validaragente(dto.agenteId);
    }

    return this.prisma.ticket.create({
      data: {
        titulo: dto.titulo,
        descripcion: dto.descripcion || null,
        prioridad: dto.prioridad,
        agenteId: dto.agenteId || null,
        usuarioId: userid,
        categoriaId: dto.categoriaId,
      },
    });
  }

  async update(id: number, dto: UpdateTicketDto, userid: number) {
    const idencontrado = await this.findoneall(id, userid);
    const user = await this.prisma.user.findUnique({
      where: { id: userid },
    });
    if (dto.agenteId) {
      if (user?.role === Role.EMPLEADO) {
        throw new BadRequestException(
          `Los empleados no pueden asignar o reasignar agentes`,
        );
      }
      await this.validaragente(dto.agenteId);
    }
    if (dto.estado) {
      if (idencontrado?.estado === dto.estado) {
        throw new BadRequestException(
          `el estado del tikect ya se encuentra en esta ${dto.estado}`,
        );
      }
      this.validarestado(idencontrado!.estado, dto.estado, user!.role);
    }
    return this.prisma.ticket.update({
      where: { id: id },
      data: {
        ...(dto.agenteId && { agenteId: dto.agenteId }),
        ...(dto.estado && { estado: dto.estado }),
      },
    });
  }
  private async validaragente(agenteId: number) {
    const agente = await this.prisma.user.findFirst({
      where: { id: agenteId, role: Role.AGENTE },
    });
    if (!agente) {
      throw new BadRequestException(
        `el susuario con id ${agenteId} no exite o no es un Agente`,
      );
    }
  }

  private validarestado(actual: EstadoTicket, nuevo: EstadoTicket, role: Role) {
    const permitidas: Record<
      Role,
      Partial<Record<EstadoTicket, EstadoTicket[]>>
    > = {
      [Role.EMPLEADO]: {
        [EstadoTicket.ABIERTO]: [EstadoTicket.CERRADO],
        [EstadoTicket.RESUELTO]: [EstadoTicket.CERRADO, EstadoTicket.ENPROCESO],
        [EstadoTicket.ENPROCESO]: [],
        [EstadoTicket.CERRADO]: [],
      },
      [Role.AGENTE]: {
        [EstadoTicket.ABIERTO]: [EstadoTicket.ENPROCESO, EstadoTicket.CERRADO],
        [EstadoTicket.ENPROCESO]: [EstadoTicket.RESUELTO],
        [EstadoTicket.RESUELTO]: [EstadoTicket.ENPROCESO, EstadoTicket.CERRADO],
        [EstadoTicket.CERRADO]: [],
      },
      [Role.ADMIN]: {
        [EstadoTicket.ABIERTO]: [EstadoTicket.ENPROCESO, EstadoTicket.CERRADO],
        [EstadoTicket.ENPROCESO]: [EstadoTicket.RESUELTO, EstadoTicket.CERRADO],
        [EstadoTicket.RESUELTO]: [EstadoTicket.CERRADO],
        [EstadoTicket.CERRADO]: [],
      },
    };
    const resuelto = permitidas[role]?.[actual] || [];
    if (!resuelto.includes(nuevo)) {
      throw new BadRequestException(
        `el usuairo con ron ${role} no puede cambiar el estado de ${actual} a ${nuevo}`,
      );
    }
  }
}
