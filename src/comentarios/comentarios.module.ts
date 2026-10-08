import { Module } from '@nestjs/common';
import { ComentariosController } from './comentarios.controller.js';
import { ComentariosService } from './comentarios.service.js';

@Module({
    controllers: [ComentariosController],
    providers: [ComentariosService],
    exports: [ComentariosService], // Lo exportamos por si otros módulos lo necesitan en el futuro
})
export class ComentariosModule {}