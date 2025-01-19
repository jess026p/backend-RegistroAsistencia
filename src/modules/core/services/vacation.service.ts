import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VacationEntity } from '@core/entities';
import { CoreRepositoryEnum } from '@shared/enums';

@Injectable()
export class VacationService {
  constructor(
    @Inject(CoreRepositoryEnum.VACATION_REPOSITORY) private readonly repository: Repository<VacationEntity>,
  ) {}

  // Crear vacaciones
  async create(payload: any): Promise<VacationEntity> {
    const entity = this.repository.create();
    entity.userId = payload.userId;


    return await this.repository.save(entity);
  }

  // Encontrar todas las vacaciones
  async findAll(): Promise<VacationEntity[]> {
    return await this.repository.find({
      relations: { user: true, vacationDetails: true },
    });
  }

  // Encontrar vacaciones por ID
  async findOne(id: string): Promise<VacationEntity> {
    const entity = await this.repository.findOne({
      relations: { user: true, vacationDetails: true },
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return entity;
  }

  // Actualizar vacaciones
  async update(id: string, payload: any): Promise<VacationEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }


    return await this.repository.save(entity);
  }

  // Eliminar vacaciones (borrado lógico)
  async delete (id: string): Promise<VacationEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return await this.repository.softRemove(entity);
  }
}
