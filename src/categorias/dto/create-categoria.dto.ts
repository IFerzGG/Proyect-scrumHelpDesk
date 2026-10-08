import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({
    example: 'Hardware',
    description: 'el nombre de la categoria a ser creada',
  })
  @IsString({ message: 'el nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'el nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener almenos 2 caracteres' })
  @Matches(/\S/, {
    message: 'El nombre  no puede contener solo espacios',
  })
  nombre: string;
  @ApiProperty({
    example: 'Una breve descripción de la categoría',
    description: 'el nombre de la categoria a ser creada',
  })
  @IsOptional()
  @IsString({ message: 'el nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener almenos 2 caracteres' })
  @Matches(/\S/, {
    message: 'El nombre  no puede contener solo espacios',
  })
  descripcion?: string;
}
