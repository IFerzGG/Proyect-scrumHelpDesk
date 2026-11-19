import { Role } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificacionesGateway } from './notificaciones.gateway.js';
import { NotificacionesService } from './notificaciones.service.js';

describe('NotificacionesService', () => {
  const emitted: {
    room: string;
    event: string;
    payload: { ticketId: number; mensaje: string };
  }[] = [];
  const users = [
    { id: 1, role: Role.ADMIN },
    { id: 2, role: Role.EMPLEADO },
    { id: 3, role: Role.AGENTE },
    { id: 4, role: Role.ADMIN },
    { id: 5, role: Role.AGENTE },
  ];

  let service: NotificacionesService;

  beforeEach(() => {
    emitted.length = 0;
    const gateway = {
      server: {
        to: (room: string) => ({
          emit: (event: string, payload: { ticketId: number; mensaje: string }) =>
            emitted.push({ room, event, payload }),
        }),
      },
    };
    const prisma = {
      user: {
        findMany: vi.fn(
          ({ where }: { where: { role: { in: Role[] } } }) =>
            Promise.resolve(
              users
                .filter((user) => where.role.in.includes(user.role))
                .map(({ id }) => ({ id })),
            ),
        ),
      },
    };

    service = new NotificacionesService(
      gateway as unknown as NotificacionesGateway,
      prisma as unknown as PrismaService,
    );
  });

  it('notifies the ticket owner, assigned agent, and admins about comments, except the author', async () => {
    await service.handleComentarioCreado({
      ticketId: 20,
      autorId: 5,
      creadorId: 2,
      agenteId: 3,
    });

    expect(emitted.map(({ room }) => room)).toEqual([
      'user:2',
      'user:1',
      'user:4',
      'user:3',
    ]);
    expect(emitted.every(({ event }) => event === 'nuevoComentario')).toBe(true);
    expect(emitted.some(({ room }) => room === 'user:5')).toBe(false);
  });

  it('notifies all roles when a new ticket is created, including agents when it is unassigned', async () => {
    await service.handleTicketCreado({
      ticketId: 21,
      creadorId: 2,
      agenteId: null,
    });

    expect(emitted.map(({ room }) => room)).toEqual([
      'user:2',
      'user:1',
      'user:4',
      'user:3',
      'user:5',
    ]);
    expect(emitted.find(({ room }) => room === 'user:2')?.payload.mensaje).toBe(
      'Tu ticket #21 fue creado correctamente.',
    );
  });

  it('notifies stakeholders about status and assignment changes without notifying the actor', async () => {
    await service.handleTicketActualizado({
      ticketId: 22,
      creadorId: 2,
      actorId: 4,
      estadoAnterior: 'ABIERTO',
      nuevoEstado: 'ENPROCESO',
      agenteAnteriorId: 3,
      agenteId: 5,
    });

    expect(emitted.map(({ room }) => room)).toEqual([
      'user:2',
      'user:1',
      'user:3',
      'user:5',
    ]);
    expect(emitted.find(({ room }) => room === 'user:5')?.payload.mensaje).toBe(
      'Te asignaron el ticket #22.',
    );
    expect(
      emitted.find(({ room }) => room === 'user:2')?.payload.mensaje,
    ).toContain('ABIERTO a ENPROCESO');
    expect(emitted.some(({ room }) => room === 'user:4')).toBe(false);
  });
});
