import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import type { Request as ExpressRequest } from 'express'; 
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { Publico } from './decorators/publico.decorator.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @ApiOperation({summary:"Logea un Usuario Exsistente"})
    @HttpCode(HttpStatus.OK)
    @Publico()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req:ExpressRequest){
        return this.authService.login(req.user);
    }

    @ApiOperation({summary:"Registra un Nuevo Usuario"})
    @ApiResponse({ status:201, description: 'Usuario Creado Exitosamente'})
    @ApiResponse({ status:400, description: 'Solicitud mal Formateada'})
    @Publico()
    @Post('register')
    async register(@Body() data:RegisterDto){
        return this.authService.register(data);
    }

    @ApiOperation({summary:"Retorna Informacion del Usuario Logeado"})
    @Get('profile')
    profile(@Req() req:ExpressRequest){
        return req.user;
    }
}
