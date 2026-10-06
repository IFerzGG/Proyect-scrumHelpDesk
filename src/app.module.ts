import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { PrismaService } from './prisma/prisma.service.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      validationSchema:envValidationSchema,
      validationOptions:{
        libraryOptions:{
          abortEarly:false,
          allowUnknown:true,
        },
      },
    }),
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'scrum-proyect',
    }),
    PrismaModule,
    CategoriasModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService,PrismaService, {provide:APP_GUARD, useClass:JwtAuthGuard}],
})
export class AppModule {}
