import type { Ticket } from '../types/ticket';
import type { ActividadSemanal } from '../components/dashboard/TicketActivityChart';

export function calcularActividadSemanal(
  tickets: Ticket[],
): ActividadSemanal[] {
  const hoy = new Date();

  // Obtener el lunes de la semana actual.
  const inicioSemana = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate(),
  );

  const diaSemana = (inicioSemana.getDay() + 6) % 7;
  inicioSemana.setDate(inicioSemana.getDate() - diaSemana);

  const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return nombresDias.map((day, indice) => {
    const inicioDia = new Date(inicioSemana);
    inicioDia.setDate(inicioSemana.getDate() + indice);

    const finDia = new Date(inicioDia);
    finDia.setDate(finDia.getDate() + 1);

    const ticketsDelDia = tickets.filter((ticket) => {
      const fecha = new Date(ticket.creado);

      return fecha >= inicioDia && fecha < finDia;
    });

    return {
      day,
      nuevos: ticketsDelDia.length,
      resueltos: ticketsDelDia.filter((ticket) => ticket.estado === 'RESUELTO')
        .length,
    };
  });
}
