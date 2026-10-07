import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service.js';
import { Get } from '@nestjs/common';
import type { Request } from 'express';
import { CreateTikectDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

@ApiBearerAuth()
@ApiTags('Tickets')
@Controller('ticket')
export class TicketController {
    constructor(private readonly tickectService: TicketService){}
    @ApiOperation({summary: "obtiene todos los tickets"})
    @Get()
    getall(){
        return this.tickectService.finall()
    }
    @ApiOperation({summary: "encuentra tickets que te pertencesn"})
    @Get(":id")
    getone(@Param("id") id:string, @Req() req:Request){
        return this.tickectService.findone(+id, +req)
    }
    @ApiOperation({summary: "encuentra cualquier ticket"})
    @Get("id/admin")
    getoneall(@Param('id') id: string){
        return this.tickectService.findoneall(+id)
    }
    @ApiOperation({summary: "crea un nuevo tickect"})
    @Post()
    create(@Body() dto:CreateTikectDto, @Req() req:Request){
        return this.tickectService.create(dto, +req)
    }
    @ApiOperation({summary: "actuliza el estado de un ticket"})
    @Patch(":id")
    update(@Body() dto:UpdateTicketDto, @Param('id') id:string){
        return this.tickectService.update(+id, dto)
    }
}
