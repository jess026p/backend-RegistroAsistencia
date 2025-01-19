import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FormEntity } from '@core/entities';
import { CoreRepositoryEnum } from '@shared/enums';

@Injectable()
export class FormService {
  constructor(
    @Inject(CoreRepositoryEnum.FORM_REPOSITORY) private readonly repository: Repository<FormEntity>,
  ) {
  }

  // Crear asistencia
  async create(payload: any): Promise<FormEntity> {
    const entity = this.repository.create();
    entity.logo = payload.logo;

    return await this.repository.save(entity);
  }

  // Encontrar todas las asistencias
  async findAll(): Promise<FormEntity[]> {
    return await this.repository.find({
      relations: { signers: true },
    });
  }

  // Encontrar una asistencia por ID
  async findOne(id: string): Promise<FormEntity> {
    const entity = await this.repository.findOne({
      relations: { signers: true },
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return entity;
  }

  // Actualizar asistencia
  async update(id: string, payload: any): Promise<FormEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    entity.logo = payload.user.id;
    entity.title = payload.registeredAt;

    return await this.repository.save(entity);
  }

  // Eliminar asistencia (borrado lógico)
  async delete(id: string): Promise<FormEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

   return  await this.repository.softRemove(entity);
  }

}
