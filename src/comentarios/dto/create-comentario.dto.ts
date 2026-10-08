import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateComentarioDto {
    @ApiProperty({ example: 'El servidor ya responde correctamente', description: 'Texto del comentario' })
    @IsString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'El comentario no puede estar vacío' })
    @MinLength(3, { message: 'El comentario debe tener al menos 3 caracteres' })
    comentario: string;
}