import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AttendanceEntity } from '@core/entities';
import { CoreRepositoryEnum } from '@shared/enums';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(CoreRepositoryEnum.ATTENDANCE_REPOSITORY) private readonly repository: Repository<AttendanceEntity>,
  ) {
  }

  // Crear asistencia
  async create(payload: any): Promise<AttendanceEntity> {
    const entity = this.repository.create();
    entity.userId = payload.user.id;
    entity.typeId = payload.type.id;
    entity.registeredAt = payload.registeredAt;

    return await this.repository.save(entity);
  }

  // Encontrar todas las asistencias
  async findAll(): Promise<AttendanceEntity[]> {
    return await this.repository.find({
      relations: { type:true, user: true },
    });
  }

  // Encontrar una asistencia por ID
  async findOne(id: string): Promise<AttendanceEntity> {
    const entity = await this.repository.findOne({
      relations: { user: true },
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return entity;
  }

  // Actualizar asistencia
  async update(id: string, payload: any): Promise<AttendanceEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    entity.userId = payload.user.id;
    entity.typeId = payload.type.id;
    entity.registeredAt = payload.registeredAt;

    return await this.repository.save(entity);
  }

  // Eliminar asistencia (borrado lógico)
  async delete(id: string): Promise<AttendanceEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return await this.repository.softRemove(entity);
  }
}
