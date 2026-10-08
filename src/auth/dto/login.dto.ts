import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class LoginDto{
    @ApiProperty({
        example:'user@organizacion.com',
        description:'Ingresar el Email Correctamente',
    })
    @IsOptional()
    @IsEmail({require_tld:true},{message:'El Email Debe Tener el Formato Correcto'})
    @IsNotEmpty({message:'El Email es Obligatrio'})
    email:string;
    
    @ApiProperty({
        example:'123456',
        description:'Ingresar Nueva Contraseña',
    })
    @IsOptional()
    @IsString({message:"El Password es una Cadena de Texto"})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Password es Obligatrio'})
    @MinLength(6,{message:"El Password debe tener minimo 6 caracteres"})
    password:string;
}