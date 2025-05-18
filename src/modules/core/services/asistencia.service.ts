import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AsistenciaEntity } from '../entities/asistencia.entity';
import { CreateAsistenciaDto } from '../dto/asistencia.dto';
import { HorarioEntity } from '../entities/horario.entity';
import { CoreRepositoryEnum } from '@shared/enums';

@Injectable()
export class AsistenciaService {
  constructor(
    @Inject(CoreRepositoryEnum.ASISTENCIA_REPOSITORY)
    private readonly repository: Repository<AsistenciaEntity>,
    @Inject(CoreRepositoryEnum.HORARIO_REPOSITORY)
    private readonly horarioRepository: Repository<HorarioEntity>,
  ) {}

  async marcarAsistencia(payload: CreateAsistenciaDto) {
    // Verificar asistencia existente
    const existe = await this.repository.findOne({
      where: {
        userId: payload.userId,
        fecha: payload.fecha,
        tipo: payload.tipo,
      },
    });
    if (existe) {
      throw new BadRequestException(`Ya existe un registro de ${payload.tipo} para esta fecha`);
    }

    // Obtener horario
    const horario = await this.horarioRepository.findOne({ where: { id: payload.horarioId } });
    if (!horario) throw new NotFoundException('Horario no encontrado');

    // Calcular distancia
    const distancia = this.calcularDistancia(
      payload.lat,
      payload.lng,
      horario.ubicacionLat,
      horario.ubicacionLng,
    );
    const radioPermitido = horario.radioUbicacion || 500;
    const estadoFinal = distancia <= radioPermitido ? payload.estado : 'fuera_de_zona';
    const motivoFinal = distancia <= radioPermitido ? payload.motivo : 'Fuera de la zona permitida';

    // Crear asistencia
    const asistencia = this.repository.create({
      ...payload,
      estado: estadoFinal,
      motivo: motivoFinal,
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
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
} 