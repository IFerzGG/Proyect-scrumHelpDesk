import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsEnum } from "class-validator";
import { Role } from "../../generated/prisma/enums.js";

export class RegisterDto{
    @ApiProperty({
        example:'Nombre Completo',
        description:'Insertar Nombre al Ser Creado',
    })
    @IsString({message:"El nombre es una Cadena de Texto"})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Nombre es Obligatrio'})
    nombre:string;
    
    @ApiProperty({
        example:'Apellido Completo',
        description:'Insertar Apellido al Ser Creado',
    })
    @IsString({message:"El Apellido es una Cadena de Texto"})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Apellido es Obligatrio'})
    apellido:string;
    
    @ApiProperty({
        example:'user@organizacion.com',
        description:'Ingresar el Email Correctamente',
    })
    @IsEmail({require_tld:true},{message:'El Email Debe Tener el Formato Correcto'})
    @IsNotEmpty({message:'El Email es Obligatrio'})
    email:string;

    @ApiProperty({
        example:'123456',
        description:'Ingresar Nueva Contraseña',
    })
    @IsString({message:"El Password es una Cadena de Texto"})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Password es Obligatrio'})
    @MinLength(6,{message:"El Password debe tener minimo 6 caracteres"})
    password:string;
}