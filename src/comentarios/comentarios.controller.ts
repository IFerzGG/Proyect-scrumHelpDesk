import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ComentariosService } from './comentarios.service.js';
import { CreateComentarioDto } from './dto/create-comentario.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { Request } from 'express';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Comentarios')
@Controller('comentarios')
export class ComentariosController {
    constructor(private readonly comentariosService: ComentariosService) {}

    @ApiOperation({ summary: 'Obtiene el historial de comentarios de un ticket' })
    @Get('ticket/:ticketId')
    @Roles('ADMIN', 'AGENTE', 'EMPLEADO')
    findByTicket(
        @Param('ticketId', ParseIntPipe) ticketId: number,
        @Req() req: any,
    ) {
        // Usamos req.user.userId porque así lo define el jwt.strategy.ts
      return this.comentariosService.findByTicket(ticketId, req.user.userId, req.user.role);
           
    }

    @ApiOperation({ summary: 'Crea un nuevo comentario en un ticket' })
    @Post('ticket/:ticketId')
    @Roles('ADMIN', 'AGENTE', 'EMPLEADO')
    create(
        @Param('ticketId', ParseIntPipe) ticketId: number,
        @Body() dto: CreateComentarioDto,
        @Req() req: any,
    ) {
        return this.comentariosService.create(dto, ticketId, req.user.userId, req.user.role);
    }
}