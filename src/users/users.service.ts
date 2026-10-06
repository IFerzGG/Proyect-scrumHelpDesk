import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Role } from '../generated/prisma/enums.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma:PrismaService){}

    async findByEmail(email:string){
        return await this.prisma.user.findUnique({
            where:{email},
            select:{
                id:true,
                nombre:true,
                apellido:true,
                email:true,
                role:true,
                password:true,
            },
        });
    }

    async findAll(role?:Role){
        return await this.prisma.user.findMany({
            where:role
                ?{role}
                :undefined,
            orderBy:{id:'asc'},
            select:{
                nombre:true,
                apellido:true,
                email:true,
                role:true,
            },
        });
    }

    async findOne(id:number){
        const existe = await this.prisma.user.findUnique({
            where:{id},
            select:{
                nombre:true,
                apellido:true,
                email:true,
                role:true,
            },
        });
        if(!existe)throw new NotFoundException('Usuario No Encontrado');
        return existe;
    }

    async create(data:CreateUserDto){
        const hashPassword = await bcrypt.hash(data.password,10);
        return await this.prisma.user.create({
            data:{
                nombre:data.nombre,
                apellido:data.apellido,
                email:data.email,
                password:hashPassword,
                role:data.role,
            },
            select:{
                id:true,
                nombre:true,
                apellido:true,
                email:true,
                role:true,
            },
        });
    }

    async update(id:number, data:UpdateUserDto){
        const existe = await this.prisma.user.findUnique({
            where:{id},
        });
        if(!existe)throw new NotFoundException('Usuario No Encontrado');

        const updatePassword = {
            ...data,
            ...(data.password && {hashPassword:await bcrypt.hash(data.password,10)}),
        };
        return await this.prisma.user.update({
            where:{id},
            data:updatePassword,
        });
    }

    async remove(id:number){
        const existe = await this.prisma.user.findUnique({
            where:{id},
        });
        if(!existe)throw new NotFoundException('Usuario No Encontrado');

        return await this.prisma.user.delete({
            where:{id},
        });
    }
}
