# Helpdesk frontend

Interfaz web creada con React, TypeScript, Tailwind CSS, React Router, Axios,
React Hook Form, Zod, Recharts y Socket.IO Client. Incluye la pantalla de acceso
y vistas de tickets, categorías y asignaciones.

## Desarrollo local

1. Inicia la API desde la raíz del proyecto con `npm run start:dev`.
2. Desde esta carpeta instala dependencias con `npm install`.
3. Inicia Vite con `npm run dev` y abre la URL indicada en la terminal.

La API y Socket.IO usan `http://localhost:3000` por defecto. Si el backend está
en otra dirección, crea `front-end/.env.local` con
`VITE_API_BASE_URL=http://localhost:PUERTO`.

El inicio de sesión usa `POST /auth/login` y guarda el JWT en `sessionStorage`
para mantener la sesión durante la pestaña actual. Socket.IO envía ese JWT al
conectarse y escucha `nuevoComentario`, `nuevoTicket` y `ticketActualizado`.
Las notificaciones se reciben mientras la sesión está conectada y no se
recuperan al recargar la página. Para producción, configura la URL de la API y
permite el origen del frontend en CORS del backend.

Los tickets nuevos avisan a quien los creó, a los administradores y al agente
asignado; si todavía no tienen agente, se avisa a los agentes para que puedan
atenderlos. Los comentarios y cambios avisan al solicitante, a los
administradores y a los agentes relacionados con el ticket. Al seleccionar una
notificación se abre el detalle correspondiente.
