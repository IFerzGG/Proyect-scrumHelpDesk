# 📚 Documentación del proyecto

## 🔐 Uso de Decoradores y Guards

Estos decoradores permiten controlar el acceso a los diferentes endpoints de la aplicación.

| Decorador | Descripción |
|---|---|
| `@Public()` | Permite acceder al endpoint sin necesidad de autenticación. |
| `@UseGuards(RolesGuard)` | Activa el `RolesGuard` para proteger el endpoint mediante roles. |
| `@Roles()` | Define qué roles tienen permiso para acceder al endpoint. |


**NUESTRAS RAMAS Y TABLAS QUE CORRESPONDEN**

**ENTIDADES Y SUS ATRIBUTOS**

## Entidad: Usuario
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| nombre        | Texto          | Obligatorio |
| apellido      | Texto          | Obligatorio |
| email         | Texto          | Unico       |
| password      | Texto          | Obligatorio |
| Role          | Texto          | ENUM        |
| creado        | Date           | Default     |


## Entidad: Categorias
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| nombre        | Texto          | Obligatorio |
| descripcion   | Texto          | Opcional    |
| creado        | Date           | Default     |


## Entidad: Tickets
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| titulo        | Texto          | Obligatorio |
| descripcion   | Texto          | Opcional    |
| prioridad     | Enum           | Obligatorio |
| estado        | Enum           | Default     |
| creado        | Date           | Default     |
| update        | Date           | Opcional    |
| categoria_id  | Numero         | [FK]        |
| usuario_id    | Numero         | [FK]        |


## Entidad: Comentarios
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| comentario    | Texto          | Obligatorio |
| creado        | Date           | Obligatorio |
| ticket_id     | Numero         | [FK]        |
| usuario_id    | Numero         | [FK]        |


## Entidad: Notificaciones
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| reporte       | Texto          | Obligatorio |
| mensaje       | Texto          | Obligatorio |
| tipo          | Enum           | Obligatorio |
| creado        | Date           | Default     |
| usuario_id    | Numero         | [FK]        |



**RELACIONES ENTRE ENTIDADES**

## Categorías → Tickets
Una categoría puede tener muchos Tickets, pero un Ticket pertenece a una sola categoría.

## Usuario → Tickets
Un Usuario puede tener muchos Tickets, pero un Ticket pertenece a un solo Usuario.

## Tickets → Comentario
Un Ticket puede tener muchos Comentarios, pero un Comentario pertenece a un solo Ticket.

## Usuario → Comentario
Un Usuario puede hacer muchos Comentarios, pero un Comentario pertenece a un solo Usuario.

## Usuario → Notificaciones
Un Usuario puede tener muchas Notificaciones, pero una Notificacion pertenece a un solo Usuario.

## La forma de la respuesta está documentada en el README para que un frontend pueda graficarla.

## Guía de instalación del proyecto
1. Desde una terminal de git Bash con la ruta destino del proyecto escribir "git clone https://github.com/IFerzGG/Proyect-scrumHelpDesk.git" (sin comillas).
2. Con una terminal abierta en la ubicación del proyecto escribir "npm install" (Nota: Debe estar previamente instalada una versión de Node 22.0 o superior).
3. Crear un en el mismo nivel que el archivo "env.example", nombralo ".env" y usa el ejemplo como base para ajustarlo según los parámetros de tu sistema. (JWT_SECRET debe ser de 32 caracteres o más)
4. Escribir en terminal con la ubicación del proyecto "npm install tsx && npx prisma db seed".
5. La API ya está lista y configurada para levantarse.

# Guía para inicializar API y probar EndPoints
1. En una terminal deberás ejecutar "npm run start:dev", después de unos segundos deberás ver como el servicio [Nest] manda varios mensajes.
2. En tu navegador escribe la ruta **localhost:3000/api/docs** allí encontrarás la documentación de la API.
3. Para generar un token deberás en el apartado de Auth en la ruta POST /auth/login modificar el email y password según el rol que deseas probar, algunos usuarios ya creados por la seed son:
 ```json
{
    { "email": "admin@helpdesk.com", "Role": "ADMIN" },
    { "email": "luis.agente@helpdesk.com", "Role": "AGENTE" },
    { "email": "pedro@empresa.com", "Role": "EMPLEADO" }
},{
  "password":"Password123!"
}
```
**Nota: La ruta POST auth/register sólo registra empleados**

En la respuesta al login encontrarás el token, copia su contenido sin comillas y pégalo en el botón Authorize para mantener la sesión de ese usuario ingresado abierta.

## Guía para probar las notificaciones
La API cuenta con notificaciones usando WebSockets, por el momento este es un proyecto BackEnd por lo que la visualización de dichas notificaciones será un poco diferente.
1. Con la API iniciada: Debes generar el token del usuario al cual deseas que esté "escuchando" para que reciba la notificación si se actualiza el estado de su ticket (en caso de ser empleado) o que la reciba cuando se le asigna algún ticket (en caso de ser agente) o si se crea algun comentario en el ticket en cuestión.
2. Copia ese token, abre el archivo "test-websocket.ts" en la raíz del proyecto, dentro del archivo en la linea que dice:
const token = 'Token Del Usuario que se va a conectar'; Deberás borrar todo lo que está dentro de las comillas y pegar el token que generaste en el paso 1 (debes mantener las comillas), guarda el archivo.
3. Abre otra terminal en la ubicacion del proyecto y ejecuta: "npx tsx src/test-websocket.ts", al hacer esto deberas ver en la terminal donde está corriendo la API que el usuario #N se ha conectado, prueba los diferentes endpoints para ver las notificaciones de actualización que te genera

## Notificaciones Elección y justificación en README

Elegimos **WebSockets con Socket.io** para ofrecer alertas en tiempo real.

**¿Por qué?**
1. **Tiempo real:** El usuario ve los cambios al instante sin recargar la página.
2. **Desacoplado y resiliente:** Usamos `EventEmitter`. Los módulos de Tareas y Comentarios solo emiten eventos; si el envío de la notificación falla, la operación en la base de datos no se revierte.
3. **Seguro:** La conexión al socket se autentica con el mismo token JWT de la API.

## Endpoint de Métricas (GET /metricas)

Este endpoint devuelve datos agregados listos para ser graficados por el frontend.

**Permisos:** Solo accesible para roles `ADMIN` y `AGENTE`.

**Estructura de la respuesta:**
```json
{
  "totalTickets": 15,
  "porCategoria": [
    { "categoria": "Hardware", "cantidad": 5 },
    { "categoria": "Software", "cantidad": 0 }
  ],
  "porEstado": [
    { "estado": "ABIERTO", "cantidad": 2 },
    { "estado": "ENPROCESO", "cantidad": 3 },
    { "estado": "RESUELTO", "cantidad": 10 },
    { "estado": "CERRADO", "cantidad": 0 }
  ]
}
