import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VacationDetailEntity } from '@core/entities';
import { CoreRepositoryEnum } from '@shared/enums';

@Injectable()
export class VacationDetailService {
  constructor(
    @Inject(CoreRepositoryEnum.VACATION_DETAIL_REPOSITORY) private readonly repository: Repository<VacationDetailEntity>,
  ) {}

  // Crear detalle de vacaciones
  async create(payload: any): Promise<VacationDetailEntity> {
    const entity = this.repository.create();
    entity.vacationId = payload.vacationId;
    entity.month = payload.month;
    entity.year = payload.year;
    entity.days = payload.days;

    return await this.repository.save(entity);
  }

  // Encontrar todos los detalles de vacaciones
  async findAll(): Promise<VacationDetailEntity[]> {
    return await this.repository.find({
      relations: { vacation: true },
    });
  }

  // Encontrar detalle de vacaciones por ID
  async findOne(id: string): Promise<VacationDetailEntity> {
    const entity = await this.repository.findOne({
      relations: { vacation: true },
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return entity;
  }

  // Actualizar detalle de vacaciones
  async update(id: string, payload: any): Promise<VacationDetailEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    entity.month = payload.month;
    entity.year = payload.year;
    entity.days = payload.days;

    return await this.repository.save(entity);
  }

  // Eliminar detalle de vacaciones (borrado lógico)
  async delete (id: string): Promise<VacationDetailEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return await this.repository.softRemove(entity);
  }
}
