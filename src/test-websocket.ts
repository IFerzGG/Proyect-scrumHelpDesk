import { io } from 'socket.io-client';

// Pega aquí temporalmente el JWT obtenido desde /auth/login
const token = 'Token Del Usuario que se va a conectar';

const socket = io('http://localhost:3000', {
  auth: {
    token,
  },
});

socket.on('connect', () => {
  console.log('🟢 Conectado al WebSocket');
  console.log('🆔 Socket ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('🔴 Error de conexión:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('🟡 Desconectado:', reason);
});

// Notificación: nuevo comentario
socket.on('nuevoComentario', (data) => {
  console.log('\n💬 NUEVO COMENTARIO');
  console.log('Ticket:', data.ticketId);
  console.log('Mensaje:', data.mensaje);
});

// Notificación: nuevo ticket
socket.on('nuevoTicket', (data) => {
  console.log('\n🎫 NUEVO TICKET');
  console.log('Ticket:', data.ticketId);
  console.log('Mensaje:', data.mensaje);
});

// Notificación: ticket actualizado
socket.on('ticketActualizado', (data) => {
  console.log('\n🔄 TICKET ACTUALIZADO');
  console.log('Ticket:', data.ticketId);
  console.log('Mensaje:', data.mensaje);
  console.log('Nuevo estado:', data.nuevoEstado);
});
