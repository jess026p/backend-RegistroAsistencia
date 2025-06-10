import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AsistenciaEntity } from '../entities/asistencia.entity';
import { CreateAsistenciaDto } from '../dto/asistencia.dto';
import { HorarioEntity } from '../entities/horario.entity';
import { CoreRepositoryEnum } from 'src/shared/enums/core-repository.enum';
import { Between } from 'typeorm';
import { UserEntity } from 'src/modules/auth/entities/user.entity';
import { ILike } from 'typeorm';
import axios from 'axios';

function calcularEstadoYMotivoBackend(
  ahora: string,
  horario: HorarioEntity,
  lat: number,
  lng: number,
): { estado: string, motivo: string } {
  const toleranciaAntes = horario.toleranciaInicioAntes || 0;
  const toleranciaDespues = horario.toleranciaInicioDespues || 0;
  const atrasoPermitido = horario.atrasoPermitido || 0;

  const hoyFecha = new Date().toISOString().slice(0, 10);
  const horaInicioStr = horario.horaInicio.slice(0,5);
  const horaFinStr = horario.horaFin.slice(0,5);
  const horaInicio = new Date(`${hoyFecha}T${horaInicioStr}`);
  const horaFin = new Date(`${hoyFecha}T${horaFinStr}`);

  const [h, m] = ahora.split(':').map(Number);
  const ahoraDate = new Date(`${hoyFecha}T${ahora}`);
  ahoraDate.setHours(h, m, 0, 0);

  const inicioRango = new Date(horaInicio.getTime() - toleranciaAntes * 60000);
  const finRango = new Date(horaFin.getTime() + atrasoPermitido * 60000);

  const finPuntual = new Date(horaInicio.getTime() + toleranciaDespues * 60000);
  const finAtraso = new Date(finPuntual.getTime() + atrasoPermitido * 60000);

  const distancia = this.calcularDistancia(
    lat, lng,
    horario.ubicacionLat, horario.ubicacionLng
  );
  const dentroDeZona = distancia <= (horario.radioUbicacion || 500);

  // Para salida, solo permitir después de la hora de fin, y distinguir si está dentro o fuera de la zona
  if (ahoraDate >= horaFin) {
    if (dentroDeZona) {
      return { estado: 'salida', motivo: 'Salida dentro de la zona asignada' };
    } else {
      return { estado: 'salida_fuera_de_zona', motivo: 'Salida fuera de la zona asignada' };
    }
  }

  // Para entradas, mantener la lógica original pero con mensajes claros
  if (ahoraDate >= inicioRango && ahoraDate <= finRango) {
    if (ahoraDate >= inicioRango && ahoraDate <= finPuntual) {
      return dentroDeZona
        ? { estado: 'entrada', motivo: 'Entrada puntual dentro de la zona asignada' }
        : { estado: 'fuera_de_zona', motivo: 'Entrada puntual fuera de la zona asignada' };
    }
    if (ahoraDate > finPuntual && ahoraDate <= finAtraso) {
      return dentroDeZona
        ? { estado: 'atraso', motivo: 'Entrada con atraso dentro de la zona asignada' }
        : { estado: 'fuera_de_zona', motivo: 'Entrada con atraso fuera de la zona asignada' };
    }
    return dentroDeZona
      ? { estado: 'presente', motivo: 'Marcó durante el horario vigente dentro de la zona asignada' }
      : { estado: 'fuera_de_zona', motivo: 'Marcó durante el horario vigente fuera de la zona asignada' };
  }

  return { estado: 'fuera_de_rango', motivo: 'Fuera del rango permitido para marcar asistencia' };
}

// Fuera de la clase
function fechaToYMD(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Función para obtener dirección desde el backend usando Nominatim
export async function getDireccionReverseGeocoding(lat: number, lng: number): Promise<any> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'RegistroAsistencia/1.0 (tucorreo@dominio.com)'
    }
  });
  return response.data;
}

@Injectable()
export class AsistenciaService {
  constructor(
    @Inject(CoreRepositoryEnum.ASISTENCIA_REPOSITORY)
    private readonly repository: Repository<AsistenciaEntity>,
    @Inject(CoreRepositoryEnum.HORARIO_REPOSITORY)
    private readonly horarioRepository: Repository<HorarioEntity>,
    @Inject(CoreRepositoryEnum.NOTIFICACION_REPOSITORY)
    private readonly notificacionRepository: Repository<any>,
  ) {}
  async marcarAsistencia(payload: CreateAsistenciaDto) {
    const horario = await this.horarioRepository.findOne({ where: { id: payload.horarioId } });
    if (!horario) throw new NotFoundException('Horario no encontrado');
  
    // Validar que la fecha de marcación esté dentro del rango de fechas del horario
    const fechaInicioTurno = horario.fechaInicio; // Usar solo fechaInicio
    const fechaFinRepeticion = horario.fechaFinRepeticion;
    if (fechaInicioTurno && payload.fecha < fechaInicioTurno) {
      throw new BadRequestException('No puedes marcar antes de la fecha de inicio del turno');
    }
    if (fechaFinRepeticion && payload.fecha > fechaFinRepeticion) {
      throw new BadRequestException('No puedes marcar después de la fecha de fin de repetición del turno');
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

    // NO permitir marcar salida si no hay entrada registrada
    if (!existe && estado === 'salida') {
      throw new BadRequestException('Debes marcar la entrada antes de poder registrar la salida.');
    }

    // CASO 1: NO EXISTE REGISTRO AÚN (entrada)
    if (!existe) {
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
      const savedAsistencia = await this.repository.save(asistencia);
      return savedAsistencia;
    }

    // CASO 2: YA EXISTE REGISTRO, MARCAR SALIDA
    if (existe.hora_salida) {
      throw new BadRequestException('Ya has registrado tu salida para este horario');
    }

    // Permitir marcar salida en cualquier momento después de la entrada
    const horaEntrada = new Date(`${payload.fecha}T${existe.hora}`);
    const horaSalida = new Date(`${payload.fecha}T${payload.hora}`);
    
    if (horaSalida < horaEntrada) {
      throw new BadRequestException('La hora de salida no puede ser anterior a la hora de entrada');
    }

    // Calcular tiempo total
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
    const savedAsistencia = await this.repository.save(existe);
    return savedAsistencia;
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
    const ultimoDiaMes = new Date(Number(yyyy), Number(mm), 0).getDate();
    for (let d = 1; d <= ultimoDiaMes; d++) {
      const mesIndex = Number(mm) - 1;
      const fecha = new Date(Number(yyyy), mesIndex, d);
      const fechaYMD = fechaToYMD(fecha);
      const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay();
      for (const horario of horarios) {
        const inicioYMD = horario.fechaInicio ? fechaToYMD(new Date(horario.fechaInicio)) : null;
        const finRepeticionYMD = horario.fechaFinRepeticion ? fechaToYMD(new Date(horario.fechaFinRepeticion)) : null;
        if (typeof horario.dias === 'string' && horario.dias) {
          const diasArray = (horario.dias as string).split(',').map(d => Number(d.trim())).filter(n => !isNaN(n));
          const enRango = (!inicioYMD || fechaYMD >= inicioYMD) && (!finRepeticionYMD || fechaYMD <= finRepeticionYMD);
          if (diasArray.includes(diaSemana) && enRango) {
            diasHabiles.push(`${yyyy}-${mm}-${String(d).padStart(2, '0')}`);
            break;
          }
        } else if (Array.isArray(horario.dias)) {
          const enRango = (!inicioYMD || fechaYMD >= inicioYMD) && (!finRepeticionYMD || fechaYMD <= finRepeticionYMD);
          if (horario.dias.includes(diaSemana) && enRango) {
            diasHabiles.push(`${yyyy}-${mm}-${String(d).padStart(2, '0')}`);
            break;
          }
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
    const mm = mes ? String(mes).padStart(2, '0') : String(fechaActual.getMonth() + 1).padStart(2, '0');
    const yyyy = anio || fechaActual.getFullYear();
    const mesNum = Number(mm);
    const anioNum = Number(yyyy);
    console.log('Mes recibido:', mes, 'mm:', mm, 'mesNum:', mesNum, 'Año recibido:', anio, 'yyyy:', yyyy, 'anioNum:', anioNum);
    if (!mes || isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
      throw new BadRequestException('Mes inválido');
    }
    if (!anio || isNaN(anioNum) || anioNum < 2000 || anioNum > 3000) {
      throw new BadRequestException('Año inválido');
    }
    const dd = String(fechaActual.getDate()).padStart(2, '0');
    const fechaHoy = `${yyyy}-${mm}-${dd}`;

    // Buscar todos los horarios asignados para hoy
    const horarios = await this.horarioRepository.find({ where: { userId } });
    const diaSemana = fechaActual.getDay() === 0 ? 7 : fechaActual.getDay();
    const horariosHoy = horarios.filter(h => {
      const inicioYMD = h.fechaInicio ? fechaToYMD(new Date(h.fechaInicio)) : null;
      let finRepeticionYMD = h.fechaFinRepeticion ? fechaToYMD(new Date(h.fechaFinRepeticion)) : null;
      // Si no tiene fecha de fin de repetición, se toma igual a la fecha de inicio
      if (!finRepeticionYMD && inicioYMD) finRepeticionYMD = inicioYMD;
      const enRango = (!inicioYMD || fechaHoy >= inicioYMD) && (!finRepeticionYMD || fechaHoy <= finRepeticionYMD);
      return h.dias.includes(diaSemana) && enRango;
    });

    // Buscar asistencias de hoy
    const asistenciasHoy = await this.repository.find({
      where: { userId, fecha: fechaHoy },
      order: { hora: 'ASC' },
    });

    // Armar resumen por cada horario
    const registro_hoy = horariosHoy.map(horario => {
      const asistencia = asistenciasHoy.find(a => a.horarioId === horario.id);
      return {
        horario: `${horario.horaInicio} - ${horario.horaFin}`,
        estado_entrada: asistencia ? asistencia.estado : '-',
        hora_entrada: asistencia ? asistencia.hora : '-',
        motivo_entrada: asistencia ? asistencia.motivo : '-',
        lat_entrada: asistencia ? asistencia.lat : null,
        lng_entrada: asistencia ? asistencia.lng : null,
        estado_salida: asistencia ? (asistencia.estado_salida || '-') : '-',
        hora_salida: asistencia ? (asistencia.hora_salida || '-') : '-',
        motivo_salida: asistencia ? (asistencia.motivo_salida || '-') : '-',
        lat_salida: asistencia ? asistencia.lat_salida : null,
        lng_salida: asistencia ? asistencia.lng_salida : null,
      };
    });

    if (registro_hoy.length === 0) {
      registro_hoy.push({
        horario: '-',
        estado_entrada: '-',
        hora_entrada: '-',
        motivo_entrada: 'Sin horario asignado',
        lat_entrada: null,
        lng_entrada: null,
        estado_salida: '-',
        hora_salida: '-',
        motivo_salida: 'Sin horario asignado',
        lat_salida: null,
        lng_salida: null,
      });
    }

    // --- Lógica de días laborados, faltas y atrasos ---
    const ultimoDiaMes = new Date(Number(yyyy), Number(mm), 0).getDate();
    const primerDiaMes = `${yyyy}-${mm}-01`;
    const ultimoDia = `${yyyy}-${mm}-${ultimoDiaMes}`;
    const asistenciasMes = await this.repository.find({
      where: { userId, fecha: Between(primerDiaMes, ultimoDia) },
      order: { fecha: 'ASC', hora: 'ASC' },
    });
   // const fechasAsistidas = new Set(asistenciasMes.map(a => a.fecha + '|' + a.horarioId));
    let diasHabiles: { fecha: string, horario: any }[] = [];
    let faltasCount = 0;
    if (horarios.length > 0) {
      diasHabiles = [];
      for (let d = 1; d <= ultimoDiaMes; d++) {
        const mesIndex = Number(mm) - 1;
        const fecha = new Date(Number(yyyy), mesIndex, d);
        const fechaYMD = fechaToYMD(fecha);
        const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay();
        for (const horario of horarios) {
          const inicioYMD = horario.fechaInicio ? fechaToYMD(new Date(horario.fechaInicio)) : null;
          let finRepeticionYMD = horario.fechaFinRepeticion ? fechaToYMD(new Date(horario.fechaFinRepeticion)) : null;
          if (!finRepeticionYMD && inicioYMD) finRepeticionYMD = inicioYMD;
          if (typeof horario.dias === 'string' && horario.dias) {
            const diasArray = (horario.dias as string).split(',').map(d => Number(d.trim())).filter(n => !isNaN(n));
            const enRango = (!inicioYMD || fechaYMD >= inicioYMD) && (!finRepeticionYMD || fechaYMD <= finRepeticionYMD);
            if (diasArray.includes(diaSemana) && enRango) {
              diasHabiles.push({ fecha: fechaYMD, horario });
              break;
            }
          } else if (Array.isArray(horario.dias)) {
            const enRango = (!inicioYMD || fechaYMD >= inicioYMD) && (!finRepeticionYMD || fechaYMD <= finRepeticionYMD);
            if (horario.dias.includes(diaSemana) && enRango) {
              diasHabiles.push({ fecha: fechaYMD, horario });
              break;
            }
          }
        }
      }
      // Solo calcula faltas si hay días hábiles
      const fechasAsistidas = new Set(asistenciasMes.map(a => a.fecha + '|' + a.horarioId));
      const hoy = new Date();
      const hoyYMD = fechaToYMD(hoy);
      const horaActual = hoy.toTimeString().slice(0, 5);
      const faltas = diasHabiles.filter(({ fecha, horario }) => {
        const key = fecha + '|' + horario.id;
        if (fechasAsistidas.has(key)) return false;
        if (fecha < hoyYMD) return true;
        if (fecha === hoyYMD) {
          // Si la hora de fin ya pasó
          return horario.horaFin < horaActual;
        }
        return false;
      });
      faltasCount = faltas.length;
    }
    const atrasos = asistenciasMes.filter(a => a.estado === 'atraso' || a.estado_salida === 'atraso').length;

    // Cambiar lógica: días laborados por día calendario
    const fechasLaboradas = new Set();
    for (const a of asistenciasMes) {
      const horario = horarios.find(h => h.id === a.horarioId);
      if (horario) {
        fechasLaboradas.add(a.fecha);
      }
    }
    const diasLaborados = fechasLaboradas.size;

    return {
      mes: mm,
      anio: yyyy,
      dias_laborados: diasLaborados,
      faltas_sin_justificacion: faltasCount,
      atrasos: atrasos,
      registro_hoy,
    };
  }

  async getHistorialAsistenciaUsuario(userId: string, mes?: string, anio?: string): Promise<any[]> {
    const fechaActual = new Date();
    const mm = mes ? String(mes).padStart(2, '0') : String(fechaActual.getMonth() + 1).padStart(2, '0');
    const yyyy = anio || fechaActual.getFullYear();
    const mesNum = Number(mm);
    const anioNum = Number(yyyy);
    console.log('Mes recibido:', mes, 'mm:', mm, 'mesNum:', mesNum, 'Año recibido:', anio, 'yyyy:', yyyy, 'anioNum:', anioNum);
    if (!mes || isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
      throw new BadRequestException('Mes inválido');
    }
    if (!anio || isNaN(anioNum) || anioNum < 2000 || anioNum > 3000) {
      throw new BadRequestException('Año inválido');
    }
    const ultimoDiaMes = new Date(Number(yyyy), Number(mm), 0).getDate();

    const primerDiaMes = `${yyyy}-${mm}-01`;
    const ultimoDia = `${yyyy}-${mm}-${String(ultimoDiaMes).padStart(2, '0')}`;

    // Obtener horarios que estén activos en el mes seleccionado
    const horarios = await this.horarioRepository.find({ where: { userId } });
    // Reforzar el filtro: solo horarios activos en el mes seleccionado
    const horariosFiltrados = horarios.filter(horario => {
      const inicioYMD = horario.fechaInicio ? fechaToYMD(new Date(horario.fechaInicio)) : null;
      const finRepeticionYMD = horario.fechaFinRepeticion ? fechaToYMD(new Date(horario.fechaFinRepeticion)) : null;
      // El horario debe estar activo en algún día del mes seleccionado
      return (!inicioYMD || inicioYMD <= ultimoDia) && (!finRepeticionYMD || finRepeticionYMD >= primerDiaMes);
    });

    const asistencias = await this.repository.find({
      where: { userId, fecha: Between(primerDiaMes, ultimoDia) },
      order: { fecha: 'ASC', hora: 'ASC' },
    });

    const historial: any[] = [];
    for (let d = 1; d <= ultimoDiaMes; d++) {
      const mesIndex = Number(mm) - 1;
      const fecha = new Date(Number(yyyy), mesIndex, d);
      const fechaYMD = fechaToYMD(fecha);
      if (fecha.getFullYear() !== Number(yyyy) || fecha.getMonth() !== mesIndex) continue;
      const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay();
      // Filtrar horarios válidos para este día (solo si el horario está activo en este día exacto)
      const horariosDelDia = horariosFiltrados.filter(horario => {
        const inicioYMD = horario.fechaInicio ? fechaToYMD(new Date(horario.fechaInicio)) : null;
        let finRepeticionYMD = horario.fechaFinRepeticion ? fechaToYMD(new Date(horario.fechaFinRepeticion)) : null;
        if (!finRepeticionYMD && inicioYMD) finRepeticionYMD = inicioYMD;
        const enRango = (!inicioYMD || fechaYMD >= inicioYMD) && (!finRepeticionYMD || fechaYMD <= finRepeticionYMD);
        const diasHorario = Array.isArray(horario.dias) ? horario.dias.map(Number) : [];
        return enRango && diasHorario.includes(diaSemana);
      });
      if (horariosDelDia.length === 0) continue;
      for (const horario of horariosDelDia) {
        // Solo mostrar asistencias que correspondan a un horario asignado
        const asistenciasDeEseHorario = asistencias.filter(a => a.fecha === fechaYMD && a.horarioId === horario.id);
        let asistencia: any = null;
        if (asistenciasDeEseHorario.length > 0) {
          asistenciasDeEseHorario.sort((a, b) => {
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
          asistencia = asistenciasDeEseHorario[0];
        }
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
          // Lógica para faltas solo en días pasados
          const hoy = new Date();
          const hoyYMD = fechaToYMD(hoy);
          const estado_entrada = 'Sin marcación';
          let motivo_entrada = '';
          const estado_salida = 'Sin marcación';
          let motivo_salida = '';
          if (fechaYMD < hoyYMD) {
            motivo_entrada = 'Falta injustificada';
            motivo_salida = 'Falta injustificada';
          }
          historial.push({
            fecha: fechaYMD,
            horario: `${horario.horaInicio} - ${horario.horaFin}`,
            hora_entrada: null,
            lat_entrada: null,
            lng_entrada: null,
            estado_entrada,
            motivo_entrada,
            hora_salida: null,
            lat_salida: null,
            lng_salida: null,
            estado_salida,
            motivo_salida,
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
