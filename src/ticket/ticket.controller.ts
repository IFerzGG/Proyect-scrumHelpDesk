import { Body, Controller, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service.js';
import { Get } from '@nestjs/common';
import type { Request } from 'express';
import { CreateTikectDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Tickets')
@Controller('ticket')
export class TicketController {
    constructor(private readonly tickectService: TicketService){}
    @ApiOperation({summary: "obtiene todos los tickets"})
    @Get()
    @Roles("ADMIN", "AGENTE", "EMPLEADO")
    getall(@Req() req:any){
        return this.tickectService.finall(req.user.id)
    }
    @ApiOperation({summary: "encuentra cualquier ticket"})
    @Get(":id")
    @Roles("EMPLEADO","ADMIN", "AGENTE")
    getoneall(@Param('id') id: string, @Req() req:any){
        return this.tickectService.findoneall(+id, req.user.id)
    }
    @ApiOperation({summary: "crea un nuevo tickect"})
    @Post()
    @Roles("ADMIN", "AGENTE", "EMPLEADO")
    create(@Body() dto:CreateTikectDto, @Req() req:any){
        return this.tickectService.create(dto, req.user.id)
    }
    @ApiOperation({summary: "actuliza el estado de un ticket"})
    @Patch(":id")
    @Roles("ADMIN", "AGENTE", "EMPLEADO")
    update(@Body() dto:UpdateTicketDto, @Param('id') id:string, @Req() req:any){
        return this.tickectService.update(+id, dto, req.user.id)
    }
}
