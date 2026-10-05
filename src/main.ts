import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true,
  }),);

  const config = new DocumentBuilder()
    .setTitle('Help Desk interno Api')
    .setDescription('APIRest Organizacion de Reportes de Incidencias')
    .setVersion('1.0.0')
    .addBearerAuth({
      type:'http',
      scheme:'bearer',
      bearerFormat:'JWT',
      name:'JWT',
      description:'Ingresa Tu Token Aqui',
      in:'header',
    },'JWT-auth',)
    .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, documentFactory);

  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<number>('PORT'));
}
await bootstrap();
