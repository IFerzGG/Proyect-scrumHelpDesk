import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTikectDto } from './dto/create-ticket.dto.js';
import { EstadoTicket } from '../generated/prisma/enums.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

@Injectable()
export class TicketService {
    constructor(private readonly prisma:PrismaService){}
    async finall(){
        return this.prisma.ticket.findMany({
            orderBy: {id: "asc"}
        })
    }
    async findoneall(id:number){
        return await this.prisma.ticket.findUnique({
            where: {id: id}
        })
    }

    async findone(id:number, userid:number){
        const id_encontrado = await this.prisma.ticket.findUnique({
            where: {id: id},
            include:{
                usuario: {
                    select:{
                        id:true,
                        nombre:true,
                        role: true,

                    }
                },
                categoria: {
                    select:{
                        nombre: true,
                        descripcion: true
                    }
                },
            }
        })
        if(!id_encontrado){
            throw new NotFoundException(`no se encontro el tikect con id ${id}`)
        }
        if(id_encontrado.usuarioId !== userid){
            throw new BadRequestException(`solo puedes acceder a los tikects que creaste`)
        }
        return id_encontrado
    }
        //capturar erro si la base de datos no encuentra el id  de categoria
    async create(dto: CreateTikectDto, userid: number){
        return await this.prisma.ticket.create({
            data:{
                titulo: dto.titulo,
                descripcion: dto.descripcion || null,
                prioridad: dto.prioridad,
                agenteId: dto.agenteId,
                usuarioId: userid,
                categoriaId: dto.categoriaId
            }
        })
    }
    async update(id: number, dto: UpdateTicketDto){
        const idencontrado = await this.findoneall(id)
        if(idencontrado?.estado === dto.estado){
            throw new BadRequestException(`el estado del tikect ya se encuentra en esta ${dto.estado}`)
        }
        this.validarestado(idencontrado!.estado, dto.estado)
        return this.prisma.ticket.update({
            where: {id:id},
            data:{
                estado: dto.estado
            }
        })
    }

    private validarestado(actual: EstadoTicket, nuevo: EstadoTicket){
        const permitidas : Record<EstadoTicket, EstadoTicket[]> = {
            [EstadoTicket.ABIERTO]:[EstadoTicket.CERRADO],
            [EstadoTicket.CERRADO]:[EstadoTicket.ENPROCESO],
            [EstadoTicket.ENPROCESO]:[EstadoTicket.RESUELTO],
            [EstadoTicket.RESUELTO]: []
        }
        if(!permitidas[actual].includes(nuevo)){
            throw new BadRequestException(`trnacicion del ticket no permitida ${actual} -> ${nuevo}`)
        }
    }
}
