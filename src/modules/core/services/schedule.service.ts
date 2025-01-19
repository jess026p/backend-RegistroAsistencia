import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ScheduleEntity } from '@core/entities';
import { CoreRepositoryEnum } from '@shared/enums';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(CoreRepositoryEnum.SCHEDULE_REPOSITORY) private readonly repository: Repository<ScheduleEntity>,
  ) {}

  // Crear horario
  async create(payload: any): Promise<ScheduleEntity> {
    const entity = this.repository.create();
    entity.userId = payload.userId;
    entity.dayOfWeek = payload.dayOfWeek;
    entity.startTime = payload.startTime;
    entity.endTime = payload.endTime;

    return await this.repository.save(entity);
  }

  // Encontrar todos los horarios
  async findAll(): Promise<ScheduleEntity[]> {
    return await this.repository.find({
      relations: { user: true },
    });
  }

  // Encontrar un horario por ID
  async findOne(id: string): Promise<ScheduleEntity> {
    const entity = await this.repository.findOne({
      relations: { user: true },
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    return entity;
  }

  // Actualizar horario
  async update(id: string, payload: any): Promise<ScheduleEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    entity.userId = payload.userId;
    entity.dayOfWeek = payload.dayOfWeek;
    entity.startTime = payload.startTime;
    entity.endTime = payload.endTime;

    return await this.repository.save(entity);
  }

  // Eliminar horario (borrado lógico)
  async delete (id: string): Promise<ScheduleEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    return await this.repository.softRemove(entity);
  }
}
