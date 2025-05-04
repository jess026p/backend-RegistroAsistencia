import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { CoreRepositoryEnum } from '@shared/enums';
import { ScheduleEntity } from '@core/entities';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(CoreRepositoryEnum.SCHEDULE_REPOSITORY) private readonly repository: Repository<ScheduleEntity>,
  ) {
  }

// Crear un horario
  async create(payload: CreateScheduleDto): Promise<ScheduleEntity> {
    // Validar que los datos estén presentes
    if (!payload.hourStartedAt || !payload.minuteStartedAt || !payload.hourEndedAt || !payload.minuteEndedAt || !payload.shiftType || !payload.dayOfWeek) {
      throw new BadRequestException('Todos los campos son requeridos');
    }

    // Crear la instancia del horario y asignar los datos
    const schedule = this.repository.create();
    schedule.hourStartedAt = payload.hourStartedAt;
    schedule.hourEndedAt = payload.hourEndedAt;
    schedule.minuteStartedAt = payload.minuteStartedAt;
    schedule.minuteEndedAt = payload.minuteEndedAt;
    schedule.minutesLunch = payload.minutesLunch || 0;
    schedule.shiftType = payload.shiftType;
    schedule.dayOfWeek = payload.dayOfWeek;

    // Guardar el horario en la base de datos
    return await this.repository.save(schedule);
  }

  // Encontrar todos los horarios
  async findAll(): Promise<ScheduleEntity[]> {
    return await this.repository.find();
  }

  // Encontrar un horario por ID
  async findOne(id: string): Promise<ScheduleEntity> {
    const schedule = await this.repository.findOne({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    return schedule;
  }

  // Actualizar un horario
  async update(id: string, payload: UpdateScheduleDto): Promise<ScheduleEntity> {
    const schedule = await this.repository.findOneBy({ id });

    if (!schedule) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    // Validar que los datos estén presentes
    if (!payload.hourStartedAt || !payload.minuteStartedAt || !payload.hourEndedAt || !payload.minuteEndedAt || !payload.shiftType || !payload.dayOfWeek) {
      throw new BadRequestException('Todos los campos son requeridos');
    }

    schedule.hourStartedAt = payload.hourStartedAt;
    schedule.hourEndedAt = payload.hourEndedAt;
    schedule.minuteStartedAt = payload.minuteStartedAt;
    schedule.minuteEndedAt = payload.minuteEndedAt;
    schedule.minutesLunch = payload.minutesLunch || 0;
    schedule.shiftType = payload.shiftType;
    schedule.dayOfWeek = payload.dayOfWeek;

    return await this.repository.save(schedule);
  }

  // Eliminar un horario permanentemente
  async delete(id: string): Promise<ScheduleEntity> {
    const schedule = await this.repository.findOneBy({ id });

    if (!schedule) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    return await this.repository.softRemove(schedule);
  }
}
