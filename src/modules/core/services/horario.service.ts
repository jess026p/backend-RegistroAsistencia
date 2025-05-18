import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { CoreRepositoryEnum } from 'src/shared/enums/core-repository.enum';
import { HorarioEntity } from '../entities/horario.entity';
import { CreateHorarioDto, UpdateHorarioDto } from '../dto/horario.dto';

interface HorarioAdaptado extends Omit<HorarioEntity, 'dias'> {
  dias: string;
}

@Injectable()
export class HorarioService {
  constructor(
    @Inject(CoreRepositoryEnum.HORARIO_REPOSITORY) private readonly repository: Repository<HorarioEntity>,
  ) {}

  async create(payload: CreateHorarioDto): Promise<HorarioEntity> {
    const data = { ...payload };
    if (data.fechaInicio && typeof data.fechaInicio !== 'string') {
      data.fechaInicio = (data.fechaInicio as Date).toISOString().slice(0, 10);
    }
    if (data.fechaFin && typeof data.fechaFin !== 'string') {
      data.fechaFin = (data.fechaFin as Date).toISOString().slice(0, 10);
    }
    if (data.fechaFinRepeticion && typeof data.fechaFinRepeticion !== 'string') {
      data.fechaFinRepeticion = (data.fechaFinRepeticion as Date).toISOString().slice(0, 10);
    }
    const horario = this.repository.create(data);
    return await this.repository.save(horario);
  }

  async findAll(): Promise<HorarioEntity[]> {
    return await this.repository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<HorarioEntity> {
    const horario = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!horario) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    return horario;
  }

  async update(id: string, payload: UpdateHorarioDto): Promise<HorarioEntity> {
    const horario = await this.repository.findOneBy({ id });

    if (!horario) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    const data = { ...payload };
    if (data.fechaInicio && typeof data.fechaInicio !== 'string') {
      data.fechaInicio = (data.fechaInicio as Date).toISOString().slice(0, 10);
    }
    if (data.fechaFin && typeof data.fechaFin !== 'string') {
      data.fechaFin = (data.fechaFin as Date).toISOString().slice(0, 10);
    }
    if (data.fechaFinRepeticion && typeof data.fechaFinRepeticion !== 'string') {
      data.fechaFinRepeticion = (data.fechaFinRepeticion as Date).toISOString().slice(0, 10);
    }
    this.repository.merge(horario, data);
    return await this.repository.save(horario);
  }

  async delete(id: string): Promise<HorarioEntity> {
    const horario = await this.repository.findOneBy({ id });

    if (!horario) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    return await this.repository.softRemove(horario);
  }

  async findLocationByUserId(userId: string): Promise<HorarioAdaptado[]> {
    const horarios = await this.repository.find({
      where: { userId },
      select: {
        id: true,
        nombreTurno: true,
        dias: true,
        horaInicio: true,
        horaFin: true,
        fechaInicio: true,
        fechaFin: true,
        toleranciaInicioAntes: true,
        toleranciaInicioDespues: true,
        toleranciaFinDespues: true,
        repetirTurno: true,
        fechaFinRepeticion: true,
        ubicacionNombre: true,
        ubicacionLat: true,
        ubicacionLng: true,
        radioUbicacion: true,
        userId: true
      }
    });

    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const horariosAdaptados = horarios.map(horario => {
      const diasOriginal = horario.dias;
      let diasNombres: string;
      
      try {
        if (Array.isArray(diasOriginal)) {
          if (diasOriginal.length === 1) {
            diasNombres = diasSemana[diasOriginal[0]] || 'Día no válido';
          } else {
            diasNombres = diasOriginal
              .map(d => diasSemana[d] || 'Día no válido')
              .filter(d => d !== 'Día no válido')
              .join(', ');
          }
        } else {
          diasNombres = 'Formato de días no válido';
        }
      } catch (error) {
        diasNombres = 'Error al procesar días';
      }
      
      return { ...horario, dias: diasNombres } as HorarioAdaptado;
    });

    if (!horariosAdaptados || horariosAdaptados.length === 0) {
      throw new NotFoundException('No se encontraron ubicaciones asignadas para este usuario');
    }

    return horariosAdaptados;
  }
} 