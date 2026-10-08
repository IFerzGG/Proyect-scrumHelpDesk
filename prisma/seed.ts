import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

async function main() {
  console.log('🌱  Iniciando seed...');

  // ---------- Reset total + reinicio de IDs desde 1 ----------

  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE notificaciones, comentarios, tickets, categorias, users RESTART IDENTITY CASCADE;',
  );
  console.log('  Tablas truncadas, IDs reseteados a 1');

  // ---------- Usuarios ----------

  const passwordHash = await bcrypt.hash('Password123!', SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      nombre: 'Ana',
      apellido: 'Ramírez',
      email: 'admin@helpdesk.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  const agentes = await Promise.all(
    [
      { nombre: 'Luis', apellido: 'Gómez', email: 'luis.agente@helpdesk.com' },
      { nombre: 'María', apellido: 'Torres', email: 'maria.agente@helpdesk.com' },
      { nombre: 'Carlos', apellido: 'Pérez', email: 'carlos.agente@helpdesk.com' },
    ].map((u) =>
      prisma.user.create({
        data: { ...u, password: passwordHash, role: 'AGENTE' },
      }),
    ),
  );

  const empleados = await Promise.all(
    [
      { nombre: 'Pedro', apellido: 'López', email: 'pedro@empresa.com' },
      { nombre: 'Sofía', apellido: 'Martínez', email: 'sofia@empresa.com' },
      { nombre: 'Diego', apellido: 'Hernández', email: 'diego@empresa.com' },
      { nombre: 'Lucía', apellido: 'Vargas', email: 'lucia@empresa.com' },
    ].map((u) =>
      prisma.user.create({
        data: { ...u, password: passwordHash, role: 'EMPLEADO' },
      }),
    ),
  );

  console.log(
    `  Usuarios: admin=1, agentes=2-4, empleados=5-8 (${agentes.length + empleados.length + 1} total)`,
  );

  // ---------- Categorías ----------

  const categorias = await Promise.all(
    [
      { nombre: 'Hardware', descripcion: 'Problemas con equipos físicos' },
      { nombre: 'Software', descripcion: 'Errores de aplicaciones o sistemas' },
      { nombre: 'Red', descripcion: 'Conectividad, VPN, Wi-Fi' },
      { nombre: 'Accesos', descripcion: 'Permisos, contraseñas, cuentas' },
      { nombre: 'Otros', descripcion: 'Incidencias no clasificadas' },
    ].map((c) => prisma.categoria.create({ data: c })),
  );

  console.log(`  Categorías: 1-${categorias.length}`);

  // ---------- Tickets ----------

  const ticketsData = [
    {
      titulo: 'No enciende la laptop',
      descripcion: 'La laptop asignada no enciende desde ayer por la tarde.',
      prioridad: 'ALTA' as const,
      estado: 'ABIERTO' as const,
      usuarioIdx: 0,
      categoriaIdx: 0,
    },
    {
      titulo: 'Excel se cierra solo',
      descripcion: 'Excel se cierra sin mostrar error al abrir archivos grandes.',
      prioridad: 'MEDIA' as const,
      estado: 'ENPROCESO' as const,
      usuarioIdx: 1,
      agenteIdx: 0,
      categoriaIdx: 1,
    },
    {
      titulo: 'Sin acceso a Wi-Fi de oficina',
      descripcion: 'No logro conectarme a la red corporativa desde esta mañana.',
      prioridad: 'ALTA' as const,
      estado: 'ENPROCESO' as const,
      usuarioIdx: 2,
      agenteIdx: 1,
      categoriaIdx: 2,
    },
    {
      titulo: 'Restablecer contraseña de correo',
      descripcion: 'Olvidé mi contraseña y necesito restablecerla.',
      prioridad: 'BAJA' as const,
      estado: 'RESUELTO' as const,
      usuarioIdx: 3,
      agenteIdx: 0,
      categoriaIdx: 3,
    },
    {
      titulo: 'Impresora no imprime en red',
      descripcion: 'La impresora del piso 3 no responde.',
      prioridad: 'MEDIA' as const,
      estado: 'ABIERTO' as const,
      usuarioIdx: 0,
      categoriaIdx: 0,
    },
    {
      titulo: 'Servidor de archivos lento',
      descripcion: 'La transferencia de archivos es extremadamente lenta.',
      prioridad: 'CRITICO' as const,
      estado: 'ENPROCESO' as const,
      usuarioIdx: 1,
      agenteIdx: 2,
      categoriaIdx: 2,
    },
    {
      titulo: 'Error al iniciar sesión en CRM',
      descripcion: 'El CRM arroja error 500 al iniciar sesión.',
      prioridad: 'ALTA' as const,
      estado: 'ABIERTO' as const,
      usuarioIdx: 2,
      categoriaIdx: 1,
    },
    {
      titulo: 'Solicitud de acceso a carpeta compartida',
      descripcion: 'Necesito acceso a la carpeta de Marketing.',
      prioridad: 'BAJA' as const,
      estado: 'CERRADO' as const,
      usuarioIdx: 3,
      agenteIdx: 1,
      categoriaIdx: 3,
    },
    {
      titulo: 'Monitor con líneas verticales',
      descripcion: 'El monitor muestra líneas verticales intermitentes.',
      prioridad: 'MEDIA' as const,
      estado: 'ABIERTO' as const,
      usuarioIdx: 0,
      categoriaIdx: 0,
    },
    {
      titulo: 'VPN no conecta desde casa',
      descripcion: 'La VPN marca error de autenticación.',
      prioridad: 'ALTA' as const,
      estado: 'RESUELTO' as const,
      usuarioIdx: 1,
      agenteIdx: 0,
      categoriaIdx: 2,
    },
  ];

  const tickets = [];
  for (const t of ticketsData) {
    const ticket = await prisma.ticket.create({
      data: {
        titulo: t.titulo,
        descripcion: t.descripcion,
        prioridad: t.prioridad,
        estado: t.estado,
        usuarioId: empleados[t.usuarioIdx].id,
        agenteId: t.agenteIdx !== undefined ? agentes[t.agenteIdx].id : null,
        categoriaId: categorias[t.categoriaIdx].id,
      },
    });
    tickets.push(ticket);
  }

  console.log(` Tickets: 1-${tickets.length}`);

  // ---------- Comentarios ----------
  await prisma.comentario.createMany({
    data: [
      {
        comentario: 'Ya estoy revisando el equipo, te confirmo en un rato.',
        usuarioId: agentes[0].id,
        ticketId: tickets[1].id,
      },
      {
        comentario: 'Gracias, quedo pendiente.',
        usuarioId: empleados[1].id,
        ticketId: tickets[1].id,
      },
      {
        comentario: '¿Podrías indicarme el número de serie de la laptop?',
        usuarioId: agentes[1].id,
        ticketId: tickets[0].id,
      },
      {
        comentario: 'El número es ABC-123-XYZ.',
        usuarioId: empleados[0].id,
        ticketId: tickets[0].id,
      },
      {
        comentario: 'Ticket resuelto, se reinició el servicio de red.',
        usuarioId: agentes[2].id,
        ticketId: tickets[9].id,
      },
    ],
  });

  console.log(' Comentarios creados');

  // ---------- Notificaciones ----------
  await prisma.notificacion.createMany({
    data: [
      {
        reporte: 'Ticket asignado',
        mensaje: 'Se te ha asignado el ticket "Excel se cierra solo".',
        tipo: 'MEDIA',
        usuarioId: agentes[0].id,
      },
      {
        reporte: 'Ticket crítico',
        mensaje: 'Se ha creado un ticket crítico: "Servidor de archivos lento".',
        tipo: 'CRITICO',
        usuarioId: admin.id,
      },
      {
        reporte: 'Ticket resuelto',
        mensaje: 'Tu ticket "VPN no conecta desde casa" fue resuelto.',
        tipo: 'BAJA',
        usuarioId: empleados[1].id,
      },
      {
        reporte: 'Nuevo comentario',
        mensaje: 'Hay un nuevo comentario en tu ticket "No enciende la laptop".',
        tipo: 'ALTA',
        usuarioId: empleados[0].id,
      },
    ],
  });

  console.log('  Notificaciones creadas');
  console.log('');
  console.log('  IDs generados (usa estos en Swagger):');
  console.log(`    admin   → ${admin.id} (${admin.email})`);
  console.log(`    agentes → ${agentes.map((a) => a.id).join(', ')}`);
  console.log(`    empleados → ${empleados.map((e) => e.id).join(', ')}`);
  console.log(`    categorías → 1..${categorias.length}`);
  console.log(`    tickets → 1..${tickets.length}`);
  console.log('');
  console.log('  Seed completado correctamente.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌  Error en el seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });