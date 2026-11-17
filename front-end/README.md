# Helpdesk frontend

Interfaz web creada con React, TypeScript, Tailwind CSS, React Router, Axios,
React Hook Form, Zod y Recharts. Incluye la pantalla de acceso y una vista de
resumen con datos de demostración; las demás funciones de negocio quedan para
una siguiente etapa.

## Desarrollo local

1. Inicia la API desde la raíz del proyecto con `npm run start:dev`.
2. Desde esta carpeta instala dependencias con `npm install`.
3. Inicia Vite con `npm run dev` y abre la URL indicada en la terminal.

Vite redirige las solicitudes de `/auth` a `http://localhost:3000`. Si la API
usa otro host o puerto, crea `front-end/.env.local` con
`VITE_API_PROXY_TARGET=http://localhost:PUERTO`.

El inicio de sesión usa `POST /auth/login` y guarda el JWT en `sessionStorage`
para mantener la sesión durante la pestaña actual. Para producción, configura
`VITE_API_BASE_URL` con la URL base de la API y permite el origen del frontend
en la configuración CORS del backend.
