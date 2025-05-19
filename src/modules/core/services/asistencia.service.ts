import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AsistenciaEntity } from '../entities/asistencia.entity';
import { CreateAsistenciaDto } from '../dto/asistencia.dto';
import { HorarioEntity } from '../entities/horario.entity';
import { CoreRepositoryEnum } from '@shared/enums';

function calcularEstadoYMotivoBackend(
  ahora: string,
  horario: HorarioEntity,
  lat: number,
  lng: number,
): { estado: string, motivo: string } {
  const toleranciaAntes = horario.toleranciaInicioAntes || 0;
  const toleranciaDespues = horario.toleranciaInicioDespues || 0;
  const atrasoPermitido = horario.atrasoPermitido || 0;
  const toleranciaFinDespues = horario.toleranciaFinDespues || 0;

  const hoyFecha = new Date().toISOString().slice(0, 10);
  const horaInicioStr = horario.horaInicio.slice(0,5);
  const horaFinStr = horario.horaFin.slice(0,5);
  const horaInicio = new Date(`${hoyFecha}T${horaInicioStr}`);
  const horaFin = new Date(`${hoyFecha}T${horaFinStr}`);

  const [h, m] = ahora.split(':').map(Number);
  const ahoraDate = new Date(`${hoyFecha}T${ahora}`);
  ahoraDate.setHours(h, m, 0, 0);

  const inicioRango = new Date(horaInicio.getTime() - toleranciaAntes * 60000);
  const finRango = new Date(horaFin.getTime() + (toleranciaFinDespues + atrasoPermitido) * 60000);

  const finPuntual = new Date(horaInicio.getTime() + toleranciaDespues * 60000);
  const finAtraso = new Date(finPuntual.getTime() + atrasoPermitido * 60000);

  const inicioSalida = horaFin;
  const finSalida = new Date(horaFin.getTime() + toleranciaFinDespues * 60000);

  const distancia = this.calcularDistancia(
    lat, lng,
    horario.ubicacionLat, horario.ubicacionLng
  );
  const dentroDeZona = distancia <= (horario.radioUbicacion || 500);

  if (ahoraDate >= inicioRango && ahoraDate <= finRango) {
    if (ahoraDate >= inicioRango && ahoraDate <= finPuntual) {
      return dentroDeZona
        ? { estado: 'entrada', motivo: 'Marcó en el rango permitido (puntual)' }
        : { estado: 'fuera_de_zona', motivo: 'Marcó fuera de la zona permitida (puntual)' };
    }

    if (ahoraDate > finPuntual && ahoraDate <= finAtraso) {
      return dentroDeZona
        ? { estado: 'atraso', motivo: 'Marcó en el rango de atraso' }
        : { estado: 'fuera_de_zona', motivo: 'Marcó fuera de la zona permitida (atraso)' };
    }

    if (ahoraDate >= inicioSalida && ahoraDate <= finSalida) {
      return dentroDeZona
        ? { estado: 'salida', motivo: 'Salida registrada en el rango permitido' }
        : { estado: 'fuera_de_zona', motivo: 'Salida fuera de la zona permitida' };
    }

    return dentroDeZona
      ? { estado: 'presente', motivo: 'Marcó durante el horario vigente' }
      : { estado: 'fuera_de_zona', motivo: 'Marcó fuera de la zona permitida (vigente)' };
  }

  return { estado: 'fuera_de_rango', motivo: 'Fuera del rango permitido para marcar asistencia' };
}

@Injectable()
export class AsistenciaService {
  constructor(
    @Inject(CoreRepositoryEnum.ASISTENCIA_REPOSITORY)
    private readonly repository: Repository<AsistenciaEntity>,
    @Inject(CoreRepositoryEnum.HORARIO_REPOSITORY)
    private readonly horarioRepository: Repository<HorarioEntity>,
  ) {}

  async marcarAsistencia(payload: CreateAsistenciaDto) {
    const existe = await this.repository.findOne({
      where: {
        userId: payload.userId,
        fecha: payload.fecha,
      },
    });

    if (existe) {
      throw new BadRequestException(`Ya existe un registro de asistencia para esta fecha`);
    }

    const horario = await this.horarioRepository.findOne({ where: { id: payload.horarioId } });
    if (!horario) throw new NotFoundException('Horario no encontrado');

    if (horario.fechaFinRepeticion && payload.fecha > horario.fechaFinRepeticion) {
      throw new BadRequestException('No puedes marcar fuera del rango de repetición del turno');
    }

    // Validar día de la semana (ajustado para evitar desfase de zona horaria usando UTC)
    const [year, month, day] = payload.fecha.split('-').map(Number);
    const fechaMarcacion = new Date(Date.UTC(year, month - 1, day));
    const diaSemana = fechaMarcacion.getUTCDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
    const diaControl = diaSemana === 0 ? 7 : diaSemana;
    console.log('DEBUG asistencia: fecha payload:', payload.fecha, 'diaControl:', diaControl, 'horario.dias:', horario.dias);
    if (!horario.dias.includes(diaControl)) {
      throw new BadRequestException('Día no válido para este horario');
    }

    // Validar que la fecha de marcación sea la fecha actual del sistema
    const fechaActualSistema = new Date();
    const yyyy = fechaActualSistema.getFullYear();
    const mm = String(fechaActualSistema.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaActualSistema.getDate()).padStart(2, '0');
    const fechaHoy = `${yyyy}-${mm}-${dd}`;
    if (payload.fecha !== fechaHoy) {
      throw new BadRequestException('Solo puedes marcar asistencia para la fecha actual');
    }

    // Usar la fecha de la marcación para calcular los rangos
       const { estado, motivo } = calcularEstadoYMotivoBackend.call(this,
      payload.hora,
      horario,
      payload.lat,
      payload.lng
    );

    if (estado === 'fuera_de_rango') {
      throw new BadRequestException('Fuera del rango permitido para marcar asistencia');
    }

    const asistencia = this.repository.create({
      ...payload,
      estado,
      motivo,
    });

    return await this.repository.save(asistencia);
  }

  async obtenerAsistenciasPorUsuario(userId: string) {
    return await this.repository.find({
      where: { userId },
      relations: ['horario'],
      order: { fecha: 'DESC', hora: 'DESC' },
    });
  }

  async obtenerAsistenciasPorUsuarioYFecha(userId: string, fecha: string) {
    return await this.repository.find({
      where: { userId, fecha },
      relations: ['horario'],
      order: { hora: 'DESC' },
    });
  }

  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
