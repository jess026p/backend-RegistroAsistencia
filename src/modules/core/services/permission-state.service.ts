import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PermissionStateEntity } from '@core/entities';
import { CoreRepositoryEnum } from '@shared/enums';

@Injectable()
export class PermissionStateService {
  constructor(
    @Inject(CoreRepositoryEnum.PERMISSION_STATE_REPOSITORY) private readonly repository: Repository<PermissionStateEntity>,
  ) {}

  // Crear estado de permiso
  async create(payload: any): Promise<PermissionStateEntity> {
    const entity = this.repository.create();
    entity.permissionId = payload.permissionId;
    entity.stateId = payload.stateId;
    entity.isCurrent = payload.isCurrent;

    return await this.repository.save(entity);
  }

  // Encontrar todos los estados de permiso
  async findAll(): Promise<PermissionStateEntity[]> {
    return await this.repository.find({
      relations: { permission: true, state: true, user: true },
    });
  }

  // Encontrar estado de permiso por ID
  async findOne(id: string): Promise<PermissionStateEntity> {
    const entity = await this.repository.findOne({
      relations: { permission: true, state: true, user: true },
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return entity;
  }

  // Actualizar estado de permiso
  async update(id: string, payload: any): Promise<PermissionStateEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    entity.stateId = payload.stateId;
    entity.isCurrent = payload.isCurrent;

    return await this.repository.save(entity);
  }

  // Eliminar estado de permiso (borrado lógico)
  async delete(id: string): Promise<PermissionStateEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return await this.repository.softRemove(entity);
  }
}
