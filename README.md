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
