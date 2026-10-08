import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: { origin: '*' }, // En producción se restringe al dominio del frontend
})
export class NotificacionesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger = new Logger(NotificacionesGateway.name);
    // Mapa para saber qué socket pertenece a qué usuario
    private userSockets: Map<number, string> = new Map();

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async handleConnection(client: Socket) {
        try {
            // El cliente debe enviar el token al conectarse: io(url, { auth: { token: '...' } })
            const token = client.handshake.auth?.token || client.handshake.query?.token;
            
            if (!token) {
                client.disconnect();
                return;
            }

            const payload = this.jwtService.verify(token as string, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            const userId = payload.sub;
            this.userSockets.set(userId, client.id);
            
            // Unir al usuario a su "sala" personal
            client.join(`user:${userId}`);
            this.logger.log(`Usuario ${userId} conectado al socket ${client.id}`);
        } catch (error) {
            this.logger.error('Token inválido en conexión WebSocket');
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        // Limpiar el mapa cuando el usuario se desconecta
        for (const [userId, socketId] of this.userSockets.entries()) {
            if (socketId === client.id) {
                this.userSockets.delete(userId);
                this.logger.log(`Usuario ${userId} desconectado`);
                break;
            }
        }
    }
}