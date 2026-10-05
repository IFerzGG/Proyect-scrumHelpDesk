import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, NotFoundException } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client.js";
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter{
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        switch(exception.code){
            case 'P2001':
                return response
                .status(404)
                .json({statusCode:404, message:'Registro No Encontrado'});
            
            case 'P2002':
                return response
                .status(409)
                .json({statusCode:409, message:'Ya Existe un Registro con ese Valor Unico'});

            case 'P2025':
                return response
                .status(404)
                .json({statusCode:404, message:'Registro No Encontrado'});

            case 'P2003':
                return response
                .status(409)
                .json({statusCode:409, message:'Registro Con Relaciones No Se Puede Eliminar'})

            case 'P2011':
                return response
                .status(400)
                .json({statusCode:400, message:'No Se Puede Guardar Null En Un Campo Obligatorio'})

            default:
                throw exception;
        }
    }
}