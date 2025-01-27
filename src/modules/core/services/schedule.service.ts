import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { CoreRepositoryEnum } from '@shared/enums';
import { ScheduleEntity } from '@core/entities';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(CoreRepositoryEnum.SCHEDULE_REPOSITORY) private readonly repository: Repository<ScheduleEntity>,
  ) {
  }

// Crear un horario
  async create(payload: any): Promise<ScheduleEntity> {
    // Crear la instancia del horario y asignar los datos
    const schedule = this.repository.create();
    schedule.hourStartedAt = payload.hourStartedAt;
    schedule.hourEndedAt = payload.hourEndedAt;
    schedule.minuteStartedAt = payload.minuteStartedAt;
    schedule.minuteEndedAt = payload.minuteEndedAt;

    // Guardar el horario en la base de datos
    return await this.repository.save(schedule);
  }

  // Encontrar todos los horarios
  async findAll(): Promise<ScheduleEntity[]> {
    return await this.repository.find( );
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
  async update(id: string, payload: any): Promise<ScheduleEntity> {
    const schedule = await this.repository.findOneBy({ id });

    if (!schedule) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    schedule.hourStartedAt = payload.hourStartedAt;
    schedule.hourEndedAt = payload.hourStartedAt;
    schedule.minuteStartedAt = payload.minuteStartedAt;
    schedule.minuteEndedAt = payload.minuteEndedAt;

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
