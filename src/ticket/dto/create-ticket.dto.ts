import { ApiProperty } from "@nestjs/swagger"
import { Prioridad } from "../../generated/prisma/enums.js"
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches, MinLength } from "class-validator"
import { Transform } from "class-transformer"

export class CreateTikectDto{
    @ApiProperty({example: "Caida de Servidor", description: "titulo del ticket"})
    @IsString()
    @Transform(({value}) => value.trim())
    @IsNotEmpty({message: "el titulo no puede estar vacio"})
    @MinLength(3,{message: "el titulo tiene que tener como minimo 3 caracteres"})
    titulo: string
    @ApiProperty({example: "El servidor no funciona", description: "descripcion del ticket"})
    @IsOptional()
    @IsString()
    @Transform(({value}) => value.trim())
    @MinLength(3,{message: "el titulo tiene que tener como minimo 3 caracteres"})
    descripcion: string
    @ApiProperty({example: "CRITICO", description: "la prioridad de arreglo del ticket"})
    @Transform(({value}) => value.toUpperCase())
    @IsEnum(Prioridad, {message: "la prioridad del ticket solo puede ser: CRITICO, ALTA, MEDIA, BAJA"})
    prioridad: Prioridad
    @ApiProperty({example: "1", description: "la categoria del ticket"})
    @IsInt({message: "el id de categoria tiene que ser un numeor entero"})
    @IsPositive({message: "el id tiene que ser un nuemero positivo"})
    categoriaId: number

    agenteId:number;//AGREGUE AQUI PARA QUE NO ME DIERAN ERRORES
}