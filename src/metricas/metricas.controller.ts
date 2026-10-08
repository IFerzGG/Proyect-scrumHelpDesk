import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MetricasService } from './metricas.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Metricas')
@Controller('metricas')
export class MetricasController {
    constructor(private readonly metricasService: MetricasService) {}

    @ApiOperation({ summary: 'Obtiene métricas agregadas del Help Desk (Solo ADMIN y AGENTE)' })
    @Get()
    @Roles('ADMIN', 'AGENTE') // Si un EMPLEADO intenta entrar, el RolesGuard lo bloqueará
    getMetricas() {
        return this.metricasService.getMetricas();
    }
}