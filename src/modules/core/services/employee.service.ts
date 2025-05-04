import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthRepositoryEnum, CoreRepositoryEnum } from '@shared/enums';
import { EmployeeEntity } from '../entities/employee.entity';
import { RoleEntity, UserEntity } from '@auth/entities';
import { RoleEnum } from '@auth/enums';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(CoreRepositoryEnum.EMPLOYEE_REPOSITORY) private readonly repository: Repository<EmployeeEntity>,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private readonly userRepository: Repository<UserEntity>,
    @Inject(AuthRepositoryEnum.ROLE_REPOSITORY) private readonly roleRepository: Repository<RoleEntity>,
  ) {
  }

  // Create
  async create(payload: any): Promise<EmployeeEntity> {
    const roles = await this.roleRepository.find({
      where: { code: RoleEnum.EMPLOYEE },
    });

    payload.password = payload.identification;
    payload.username = payload.identification;
    payload.roles = roles;

    let user = this.userRepository.create(payload) as unknown as UserEntity;
    user = (await this.userRepository.save(user));

    const entity = this.repository.create();
    entity.userId = user.id;
    entity.positionId = payload.employee.position.id;

    return await this.repository.save(entity);
  }

  // Encontrar todas las asistencias
  async findAll(): Promise<EmployeeEntity[]> {
    return await this.repository.find({
      relations: { position: true, user: true },
    });
  }

  // Encontrar una asistencia por ID
  async findOne(userId: string): Promise<UserEntity> {
    const entity = await this.userRepository.findOne({
      relations: { sex: true, employee: { position: true } },
      where: { id: userId },
    });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return entity;
  }

  // Actualizar asistencia
  async update(userId: string, payload: any): Promise<EmployeeEntity> {
    const entity = await this.userRepository.findOneBy({ id: userId });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    entity.name = payload.name;

    await this.userRepository.save(entity);

    const employee = await this.repository.findOneBy({ id: payload.employee.id });
    employee.positionId = payload.employee.position.id;
    return await this.repository.save(employee);
  }

  // Desabilitar asistencia
  async disable(id: string): Promise<EmployeeEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`deshabilitado`);
    }

    entity.enabled = false;

    return await this.repository.save(entity);
  }

  // Habilitar asistencia
  async enable(id: string): Promise<EmployeeEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Habilitado`);
    }

    entity.enabled = true;

    return await this.repository.save(entity);
  }


  // Eliminar asistencia (borrado lógico)
  async delete(id: string): Promise<EmployeeEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return await this.repository.softRemove(entity);
  }

  async assignSchedule(id: string, payload: any): Promise<EmployeeEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return await this.repository.save(entity);
  }

}
