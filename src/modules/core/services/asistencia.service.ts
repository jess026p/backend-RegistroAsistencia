import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AsistenciaEntity } from '../entities/asistencia.entity';
import { CreateAsistenciaDto } from '../dto/asistencia.dto';
import { HorarioEntity } from '../entities/horario.entity';
import { CoreRepositoryEnum } from '@shared/enums';
import { Between } from 'typeorm';
import { UserEntity } from 'src/modules/auth/entities/user.entity';
import { ILike } from 'typeorm';

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
    const horario = await this.horarioRepository.findOne({ where: { id: payload.horarioId } });
    if (!horario) throw new NotFoundException('Horario no encontrado');
  
    if (horario.fechaFinRepeticion && payload.fecha > horario.fechaFinRepeticion) {
      throw new BadRequestException('No puedes marcar fuera del rango de repetición del turno');
    }
  
    // Validar día de la semana
    const [year, month, day] = payload.fecha.split('-').map(Number);
    const fechaMarcacion = new Date(Date.UTC(year, month - 1, day));
    const diaSemana = fechaMarcacion.getUTCDay(); // 0=domingo
    const diaControl = diaSemana === 0 ? 7 : diaSemana;
  
    if (!horario.dias.includes(diaControl)) {
      throw new BadRequestException('Día no válido para este horario');
    }
  
    // Validar que la fecha de marcación sea la actual
    const fechaActualSistema = new Date();
    const yyyy = fechaActualSistema.getFullYear();
    const mm = String(fechaActualSistema.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaActualSistema.getDate()).padStart(2, '0');
    const fechaHoy = `${yyyy}-${mm}-${dd}`;
    if (payload.fecha !== fechaHoy) {
      throw new BadRequestException('Solo puedes marcar asistencia para la fecha actual');
    }
  
    // Calcular estado y motivo con base en hora y ubicación
    const { estado, motivo } = calcularEstadoYMotivoBackend.call(
      this,
      payload.hora,
      horario,
      payload.lat,
      payload.lng
    );
  
    if (estado === 'fuera_de_rango') {
      throw new BadRequestException('Fuera del rango permitido para marcar asistencia');
    }
  
    const existe = await this.repository.findOne({
      where: {
        userId: payload.userId,
        fecha: payload.fecha,
        horarioId: payload.horarioId,
      },
    });

    // Permitir marcar salida aunque no haya entrada, pero solo en el rango de salida
    if (!existe && estado === 'salida') {
      const horaActual = new Date(`${payload.fecha}T${payload.hora}`);
      const horaFin = new Date(`${payload.fecha}T${horario.horaFin}`);
      const toleranciaFin = horario.toleranciaFinDespues || 0;
      const inicioRangoSalida = new Date(horaFin.getTime() - toleranciaFin * 60000);
      if (horaActual < inicioRangoSalida) {
        throw new BadRequestException('No puedes marcar la salida antes del rango permitido');
      }
      // Registrar solo salida (sin entrada)
      const asistencia = this.repository.create({
        userId: payload.userId,
        horarioId: payload.horarioId,
        fecha: payload.fecha,
        hora: null,
        lat: null,
        lng: null,
        estado: 'sin_entrada',
        motivo: 'No se registró entrada',
        hora_salida: payload.hora,
        lat_salida: payload.lat,
        lng_salida: payload.lng,
        estado_salida: estado,
        motivo_salida: motivo,
        tiempo_total: null,
      });
      return await this.repository.save(asistencia);
    }

    // CASO 1: NO EXISTE REGISTRO AÚN (entrada)
    if (!existe) {
      if (estado === 'salida') {
        // Ya manejado arriba
        throw new BadRequestException('Debes marcar la entrada antes de poder registrar la salida.');
      }
      // ✅ permitir entrada incluso si está fuera de la zona
      const estadosEntradaPermitidos = ['entrada', 'atraso', 'fuera_de_zona'];
      if (!estadosEntradaPermitidos.includes(estado)) {
        throw new BadRequestException('Solo puedes registrar la entrada en este momento');
      }
      const asistencia = this.repository.create({
        ...payload,
        estado,
        motivo,
      });
      return await this.repository.save(asistencia);
    }

    // CASO 2: YA EXISTE REGISTRO, MARCAR SALIDA
    if (existe.hora_salida) {
      throw new BadRequestException('Ya has registrado tu salida para este horario');
    }
    const estadosSalidaPermitidos = ['salida', 'fuera_de_zona'];
    if (!estadosSalidaPermitidos.includes(estado)) {
      throw new BadRequestException('Solo puedes registrar la salida en este momento');
    }
    // Solo permitir salida si la hora actual >= hora de salida - tolerancia
    const horaActual = new Date(`${payload.fecha}T${payload.hora}`);
    const horaFin = new Date(`${payload.fecha}T${horario.horaFin}`);
    const toleranciaFin = horario.toleranciaFinDespues || 0;
    const inicioRangoSalida = new Date(horaFin.getTime() - toleranciaFin * 60000);
    if (horaActual < inicioRangoSalida) {
      throw new BadRequestException('No puedes marcar la salida antes del rango permitido');
    }
    // Calcular tiempo total
    const horaEntrada = new Date(`${payload.fecha}T${existe.hora}`);
    const horaSalida = new Date(`${payload.fecha}T${payload.hora}`);
    const tiempoTotal = horaSalida.getTime() - horaEntrada.getTime();
    const horas = Math.floor(tiempoTotal / (1000 * 60 * 60));
    const minutos = Math.floor((tiempoTotal % (1000 * 60 * 60)) / (1000 * 60));
    const tiempoTotalStr = `${horas}:${minutos.toString().padStart(2, '0')}:00`;
    existe.hora_salida = payload.hora;
    existe.lat_salida = payload.lat;
    existe.lng_salida = payload.lng;
    existe.estado_salida = estado;
    existe.motivo_salida = motivo;
    existe.tiempo_total = tiempoTotalStr;
    return await this.repository.save(existe);
  }
  
  async buscarUsuarioResumen(termino: string): Promise<any> {
    const usuario = await this.repository.manager.findOne(UserEntity, {
      where: [
        { identification: termino },
        { name: termino },
        { lastname: termino }
      ],
      select: ['id', 'name', 'lastname', 'identification']
    });
  
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
  
    return this.getResumenAsistenciaUsuario(usuario.id);
  }
  
  async getResumenByIdentificacion(termino: string): Promise<any> {
    const usuario = await this.repository.manager.findOne(UserEntity, {
      where: [
        { identification: termino },
        { name: ILike(`%${termino}%`) },
        { lastname: ILike(`%${termino}%`) },
      ],
      select: ['id', 'name', 'lastname'],
    });
  
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
  
    const fechaActual = new Date();
    const yyyy = fechaActual.getFullYear();
    const mm = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaActual.getDate()).padStart(2, '0');
    const fechaHoy = `${yyyy}-${mm}-${dd}`;
    const primerDiaMes = `${yyyy}-${mm}-01`;
  
    const asistencias = await this.repository.find({
      where: {
        userId: usuario.id,
        fecha: Between(primerDiaMes, fechaHoy),
      },
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  
    const horarios = await this.horarioRepository.find({ where: { userId: usuario.id } });
  
    const diasHabiles: string[] = [];
    for (let d = 1; d <= fechaActual.getDate(); d++) {
      const fecha = new Date(yyyy, fechaActual.getMonth(), d);
      const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay();
      for (const horario of horarios) {
        if (horario.dias.includes(diaSemana)) {
          diasHabiles.push(`${yyyy}-${mm}-${String(d).padStart(2, '0')}`);
          break;
        }
      }
    }
  
    const fechasAsistidas = asistencias.map(a => a.fecha);
    const faltas = diasHabiles.filter(d => !fechasAsistidas.includes(d));
    const atrasos = asistencias.filter(a => a.estado === 'atraso').length;
    const diasLaborados = new Set(asistencias.map(a => a.fecha)).size;
  
    const asistenciaHoy = asistencias.find(a => a.fecha === fechaHoy);
  
    const registroHoy = asistenciaHoy ? {
      estado: asistenciaHoy.estado,
      motivo: asistenciaHoy.motivo,
      entrada: {
        hora: asistenciaHoy.hora,
        lat: asistenciaHoy.lat,
        lng: asistenciaHoy.lng,
      },
      salida: asistenciaHoy.hora_salida ? {
        hora: asistenciaHoy.hora_salida,
        lat: asistenciaHoy.lat_salida,
        lng: asistenciaHoy.lng_salida,
      } : null,
    } : {
      estado: 'No registrado',
      motivo: 'Sin registro de asistencia',
      entrada: null,
      salida: null,
    };
  
    return {
      nombre: `${usuario.name} ${usuario.lastname}`,
      dias_laborados: diasLaborados,
      faltas_sin_justificacion: faltas.length,
      atrasos: atrasos,
      registro_hoy: registroHoy,
    };
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

    async getResumenAdmin(userId: string): Promise<any> {
      const usuario = await this.repository.manager.findOne(UserEntity, {
        where: { id: userId },
        select: ['id', 'name', 'lastname'],
      });
    
      if (!usuario) throw new NotFoundException('Usuario no encontrado');
    
      const asistencias = await this.repository.find({
        where: { userId },
        order: { fecha: 'DESC', hora: 'ASC' }
      });
    
      const diasLaborados = new Set(asistencias.map(a => a.fecha)).size;
      const faltas = asistencias.filter(a => !a.estado || a.estado === 'fuera_de_rango').length;
      const atrasos = asistencias.filter(a => a.estado === 'atraso').length;
    
      const registros = asistencias.map(a => ({
        estado: a.estado,
        entrada: `${a.fecha} ${a.hora}`,
        salida: a.hora_salida || '',
        mapa: true
      }));
    
      return {
        nombre: `${usuario.name} ${usuario.lastname}`,
        diasLaborados,
        faltas,
        atrasos,
        registros
      };
    }
    
  async getResumenAsistenciaUsuario(userId: string, mes?: string, anio?: string): Promise<any> {
    const fechaActual = new Date();
    const yyyy = anio || fechaActual.getFullYear();
    const mm = mes || String(fechaActual.getMonth() + 1).padStart(2, '0');
    const primerDiaMes = `${yyyy}-${mm}-01`;
    const ultimoDiaMes = new Date(Number(yyyy), Number(mm), 0).getDate();
    const fechaHoy = `${yyyy}-${mm}-${String(fechaActual.getDate()).padStart(2, '0')}`;
    const ultimoDia = `${yyyy}-${mm}-${ultimoDiaMes}`;

    const asistenciasMes = await this.repository.find({
      where: {
        userId,
        fecha: Between(primerDiaMes, ultimoDia),
      },
      order: { fecha: 'ASC', hora: 'ASC' },
    });
    const horarios = await this.horarioRepository.find({ where: { userId } });
    const diasHabiles: string[] = [];
    for (let d = 1; d <= ultimoDiaMes; d++) {
      const fecha = new Date(Number(yyyy), Number(mm) - 1, d);
      const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay();
      for (const horario of horarios) {
        if (horario.dias.includes(diaSemana)) {
          diasHabiles.push(`${yyyy}-${mm}-${String(d).padStart(2, '0')}`);
          break;
        }
      }
    }
    const fechasAsistidas = new Set(asistenciasMes.map(a => a.fecha));
    const faltas = diasHabiles.filter(dia => !fechasAsistidas.has(dia));
    const atrasos = asistenciasMes.filter(a => a.estado === 'atraso' || a.estado_salida === 'atraso').length;

    // --- RESUMEN DE HOY ---
    // Buscar todas las asistencias de hoy para el usuario
    const asistenciasHoy = asistenciasMes.filter(a => a.fecha === fechaHoy);
    // Tomar la marcación con la hora_salida más reciente, o la de entrada más reciente si no hay salida
    let registroHoyCalculado = null;
    if (asistenciasHoy.length > 0) {
      // Ordenar primero por hora_salida descendente, luego por hora descendente
      asistenciasHoy.sort((a, b) => {
        if (b.hora_salida && a.hora_salida) {
          return b.hora_salida.localeCompare(a.hora_salida);
        } else if (b.hora_salida) {
          return 1;
        } else if (a.hora_salida) {
          return -1;
        } else {
          return b.hora.localeCompare(a.hora);
        }
      });
      const asistencia = asistenciasHoy[0];
      registroHoyCalculado = {
        fecha: asistencia.fecha,
        horario: `${asistencia.hora} - ${asistencia.hora_salida || ''}`,
        hora_entrada: asistencia.hora,
        lat_entrada: asistencia.lat,
        lng_entrada: asistencia.lng,
        estado_entrada: asistencia.estado,
        motivo_entrada: asistencia.motivo,
        hora_salida: asistencia.hora_salida,
        lat_salida: asistencia.lat_salida,
        lng_salida: asistencia.lng_salida,
        estado_salida: asistencia.estado_salida,
        motivo_salida: asistencia.motivo_salida,
      };
    }

    return {
      dias_laborados: fechasAsistidas.size,
      faltas_sin_justificacion: faltas.length,
      atrasos: atrasos,
      registro_hoy: registroHoyCalculado,
    };
  }

  async getHistorialAsistenciaUsuario(userId: string, mes?: string, anio?: string): Promise<any[]> {
    const fechaActual = new Date();
    const yyyy = anio || fechaActual.getFullYear();
    const mm = mes || String(fechaActual.getMonth() + 1).padStart(2, '0');
    const primerDiaMes = `${yyyy}-${mm}-01`;
    const ultimoDiaMes = new Date(Number(yyyy), Number(mm), 0).getDate();
    const ultimoDia = `${yyyy}-${mm}-${ultimoDiaMes}`;

    const asistencias = await this.repository.find({
      where: {
        userId,
        fecha: Between(primerDiaMes, ultimoDia),
      },
      order: { fecha: 'ASC', hora: 'ASC' },
    });
    const horarios = await this.horarioRepository.find({ where: { userId } });

    const historial: any[] = [];
    for (let d = 1; d <= ultimoDiaMes; d++) {
      const fecha = `${yyyy}-${mm}-${String(d).padStart(2, '0')}`;
      const diaSemana = new Date(Number(yyyy), Number(mm) - 1, d).getDay() === 0 ? 7 : new Date(Number(yyyy), Number(mm) - 1, d).getDay();
      // Solo incluir días que tengan al menos un horario asignado
      const horariosDelDia = horarios.filter(horario => horario.dias.includes(diaSemana));
      if (horariosDelDia.length === 0) continue;
      for (const horario of horariosDelDia) {
        const asistencia = asistencias.find(a => a.fecha === fecha && a.horarioId === horario.id);
        if (asistencia) {
          historial.push({
            fecha: asistencia.fecha,
            horario: `${horario.horaInicio} - ${horario.horaFin}`,
            hora_entrada: asistencia.hora,
            lat_entrada: asistencia.lat,
            lng_entrada: asistencia.lng,
            estado_entrada: asistencia.estado,
            motivo_entrada: asistencia.motivo,
            hora_salida: asistencia.hora_salida,
            lat_salida: asistencia.lat_salida,
            lng_salida: asistencia.lng_salida,
            estado_salida: asistencia.estado_salida,
            motivo_salida: asistencia.motivo_salida,
          });
        } else {
          historial.push({
            fecha,
            horario: `${horario.horaInicio} - ${horario.horaFin}`,
            hora_entrada: null,
            lat_entrada: null,
            lng_entrada: null,
            estado_entrada: 'Sin marcación',
            motivo_entrada: 'Falta injustificada',
            hora_salida: null,
            lat_salida: null,
            lng_salida: null,
            estado_salida: 'Sin marcación',
            motivo_salida: 'Falta injustificada',
          });
        }
      }
    }
    return historial;
  }

  async findByUserAndDate(userId: string, fecha: string) {
    return await this.repository.find({
      where: { userId, fecha },
      order: { hora: 'ASC' },
    });
  }
}
