import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PermissionEntity } from '@core/entities';
import { CoreRepositoryEnum } from '@shared/enums';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(CoreRepositoryEnum.PERMISSION_REPOSITORY) private readonly repository: Repository<PermissionEntity>,
  ) {
  }

  // Crear un permiso
  async create(payload: any): Promise<PermissionEntity> {
    const entity = this.repository.create();

    entity.userId = payload.userId;
    entity.permissionTypeId = payload.permissionTypeId;
    entity.formId = payload.formId;
    entity.issuedAt = payload.issuedAt;
    entity.startedAt = payload.startedAt;
    entity.endedAt = payload.endedAt;
    entity.observation = payload.observation;
    entity.location = payload.location;
    entity.unit = payload.unit;
    entity.position = payload.position;
    entity.coordination = payload.coordination;

    return await this.repository.save(entity);
  }

  // Encontrar todos los permisos
  async findAll(): Promise<PermissionEntity[]> {
    return await this.repository.find({
      relations: {
        user: true,
        permissionType: true,
        form: true,
      },
    });
  }

  // Encontrar un permiso por ID
  async findOne(id: string): Promise<PermissionEntity> {
    const entity = await this.repository.findOne({
      relations: {
        user: true,
        permissionType: true,
        form: true,
      },
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return entity;
  }

  // Actualizar un permiso
  async update(id: string, payload: any): Promise<PermissionEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    entity.permissionTypeId = payload.permissionTypeId;
    entity.userId = payload.userId;
    entity.formId = payload.formId;
    entity.issuedAt = payload.issuedAt;
    entity.startedAt = payload.startedAt;
    entity.endedAt = payload.endedAt;
    entity.observation = payload.observation;
    entity.location = payload.location;
    entity.unit = payload.unit;
    entity.position = payload.position;
    entity.coordination = payload.coordination;

    return await this.repository.save(entity);
  }

  // Eliminar un permiso (borrado lógico)
  async delete(id: string): Promise<PermissionEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return await this.repository.softRemove(entity);
  }
}
