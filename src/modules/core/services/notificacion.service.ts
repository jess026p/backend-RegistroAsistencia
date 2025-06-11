import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificacionEntity } from '../entities/notificacion.entity';
import { CoreRepositoryEnum } from 'src/shared/enums/core-repository.enum';

@Injectable()
export class NotificacionService {
  constructor(
    @Inject(CoreRepositoryEnum.NOTIFICACION_REPOSITORY)
    private readonly repository: Repository<NotificacionEntity>,
  ) {}

  async findByUser(userId: string): Promise<any[]> {
    const notificaciones = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    const resultado = notificaciones.map(n => ({
      fecha: n.fecha,
      hora: n.hora,
      mensaje: n.mensaje,
      tipo: n.tipo || 'info',
    }));

    // --- Notificaciones informativas de horarios asignados hoy ---
    // Importar el repositorio de horarios y asistencias
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const hoyYMD = `${yyyy}-${mm}-${dd}`;
    // Buscar horarios asignados para hoy
    const horariosRepo = this.repository.manager.getRepository('HorarioEntity');
    const asistenciaRepo = this.repository.manager.getRepository('AsistenciaEntity');
    const horariosHoy = await horariosRepo.find({ where: { user: { id: userId } } });
    const diaSemana = hoy.getDay() === 0 ? 7 : hoy.getDay();
    for (const horario of horariosHoy) {
      // Filtrar por rango de fechas de vigencia
      const inicioYMD = horario.fechaInicio ? fechaToYMD(new Date(horario.fechaInicio)) : null;
      let finRepeticionYMD = horario.fechaFinRepeticion ? fechaToYMD(new Date(horario.fechaFinRepeticion)) : null;
      if (!finRepeticionYMD && inicioYMD) finRepeticionYMD = inicioYMD;
      const enRango = (!inicioYMD || hoyYMD >= inicioYMD) && (!finRepeticionYMD || hoyYMD <= finRepeticionYMD);
      if (enRango && horario.dias && horario.dias.includes(diaSemana)) {
        const asistencia = await asistenciaRepo.findOne({ where: { userId, horarioId: horario.id, fecha: hoyYMD } });
        if (!asistencia) {
          const ahora = hoy.toTimeString().slice(0, 5);
          if (horario.horaInicio < ahora) {
            resultado.unshift({
              fecha: hoyYMD,
              hora: horario.horaInicio,
              mensaje: `No marcaste la entrada para el horario de las ${horario.horaInicio} hoy.`,
              tipo: 'warning',
            });
          } else {
            resultado.unshift({
              fecha: hoyYMD,
              hora: horario.horaInicio,
              mensaje: `Tienes un horario pendiente hoy a las ${horario.horaInicio}`,
              tipo: 'info',
            });
          }
        } else if (!asistencia.hora_salida) {
          resultado.unshift({
            fecha: hoyYMD,
            hora: horario.horaFin,
            mensaje: `Tienes una salida pendiente para el horario de las ${horario.horaFin} hoy.`,
            tipo: 'warning',
          });
        }
      }
    }
    return resultado;
  }
}

// Utilidad para convertir Date a YYYY-MM-DD
function fechaToYMD(date: Date): string {
  return date.toISOString().slice(0, 10);
} 