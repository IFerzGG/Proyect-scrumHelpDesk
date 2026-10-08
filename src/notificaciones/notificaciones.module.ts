import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificacionesGateway } from './notificaciones.gateway.js';
import { NotificacionesService } from './notificaciones.service.js';

@Module({
    imports: [
        // Importamos JwtModule para poder verificar el token en el Gateway
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
            }),
        }),
    ],
    providers: [NotificacionesGateway, NotificacionesService],
    exports: [NotificacionesService],
})
export class NotificacionesModule {}