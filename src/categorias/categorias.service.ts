import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}
  async findCategoriaByName(nombre: string) {
    return await this.prisma.categoria.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
      },
    });
  }

  async createCategoria(createCategoriaDto: CreateCategoriaDto) {
    const existe = await this.findCategoriaByName(createCategoriaDto.nombre);
    if (existe) {
      throw new ConflictException('Ya existe una categoria con ese nombre');
    }
    return await this.prisma.categoria.create({
      data: {
        nombre: createCategoriaDto.nombre,
      },
    });
  }

  async findAllCategorias() {
    return await this.prisma.categoria.findMany({ orderBy: { id: 'asc' } });
  }

  async updateCategoria(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return await this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });
  }

  async findByQuery(nombre: string) {
    return this.prisma.ticket.findMany({
      where: {
        categoria: {
          nombre: {
            startsWith: nombre,
            mode: 'insensitive',
          },
        },
      },
      include: {
        categoria: true,
      },
    });
  }

  async findOneCategoria(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
    });
    if (!categoria) {
      throw new NotFoundException(`Categoria de ID: ${id} no encontrado`);
    }
    return categoria;
  }

  async removeCategoria(id: number) {
    return await this.prisma.categoria.delete({
      where: { id },
    });
  }
}
