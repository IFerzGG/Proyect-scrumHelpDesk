import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Publico } from '../auth/decorators/publico.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@UseGuards(RolesGuard)
@Roles('ADMIN')
@Controller('users')
export class UsersController {
    constructor(private readonly userService:UsersService){}

    @Get()
    @ApiOperation({summary:'Revisar Todos los Usuarios'})
    @ApiResponse({status:200, description:'Usuarios Mostrados Exitosamente'})
    findAll(@Query('roleUsuario') roleUsuario?:Role){
        return this.userService.findAll(roleUsuario);
    }

    @Get(':id')
    @ApiOperation({summary:'Revisar Un Usuario en Especifico'})
    @ApiResponse({status:200, description:'Usuario Mostrado Exitosamente'})
    findOne(@Param('id') id:string){
        return this.userService.findOne(+id);
    }

    @Post()
    @ApiOperation({summary:'Crear un Usuario'})
    @ApiResponse({status:200, description:'Usuario Creado Exitosamente'})
    @ApiResponse({status:400, description:'Usuarios Formateado Incorrectamente'})
    create(@Body() data:CreateUserDto){
        return this.userService.create(data);
    }

    @Patch(':id')
    @ApiOperation({summary:'Actualizar un Usuario'})
    @ApiResponse({status:200, description:'Usuario Actualizado Exitosamente'})
    @ApiResponse({status:404, description:'Usuario No Encontrado'})
    update(@Param('id') id:string, @Body() data:UpdateUserDto){
        return this.userService.update(+id, data);
    }

    @Delete(':id')
    @ApiOperation({summary:'Eliminar un Usuario'})
    @ApiResponse({status:200, description:'Usuario Eliminado Exitosamente'})
    @ApiResponse({status:404, description:'Usuarios no Encontrado'})
    remove(@Param() id:string){
        return this.userService.remove(+id);
    }
}
