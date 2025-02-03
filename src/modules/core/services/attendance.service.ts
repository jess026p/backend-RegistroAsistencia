import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { AttendanceEntity, EmployedEntity } from '@core/entities';
import { CommonRepositoryEnum, CoreRepositoryEnum } from '@shared/enums';
import { differenceInMinutes, format } from 'date-fns';
import { CatalogueEntity } from '@common/entities';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(CoreRepositoryEnum.ATTENDANCE_REPOSITORY) private readonly repository: Repository<AttendanceEntity>,
    @Inject(CoreRepositoryEnum.EMPLOYEE_REPOSITORY) private readonly employeeRepository: Repository<EmployedEntity>,
    @Inject(CommonRepositoryEnum.CATALOGUE_REPOSITORY) private readonly catalogueRepository: Repository<CatalogueEntity>,
  ) {
  }

  // Crear asistencia
  async create(payload: any): Promise<AttendanceEntity> {
    const entity = this.repository.create();
    entity.employeeId = payload.employeeId;
    entity.typeId = payload.typeId;
    entity.registeredAt = payload.registeredAt;
    entity.late = payload.late;
    return await this.repository.save(entity);
  }

  // Encontrar todas las asistencias
  async findAll(): Promise<AttendanceEntity[]> {
    return await this.repository.find({
      relations: { type: true, employee: { user: true } },
    });
  }

//Listar registro Ionic front
  async findAttendancesByEmployee(employeeId: string, startedAt = new Date, endedAt = new Date) {
    startedAt = new Date(startedAt);
    startedAt.setHours(0);
    startedAt.setMinutes(0);
    startedAt.setSeconds(0);

    endedAt = new Date(endedAt);
    endedAt.setHours(23);
    endedAt.setMinutes(59);
    endedAt.setSeconds(59);

    return await this.repository.find({
      relations: { type: true, employee: { user: true } },
      where: { employeeId, registeredAt: Between(startedAt, endedAt) },
    });

  }

  // Crear asistencia FRONT Ionic
  async register(employeeId: string, payload: any): Promise<AttendanceEntity> {

    const entity = this.repository.create();

    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
      relations: { schedule: true },
    });

    if (!employee.schedule) {
      throw new NotFoundException('No tiene un horario Asignado');
    }

    const currentDate = new Date();

    const attendances = await this.repository
      .createQueryBuilder('entity')
      .where('DATE(entity.registered_at) = :date AND employee_id = :employeeId AND type_id= :typeId',
        {
          date: format(currentDate, 'yyyy-MM-dd'),
          employeeId: employeeId,
          typeId: payload.type.id,
        })
      .getMany();

    if (attendances.length > 0) {
      throw new BadRequestException('Asistencia ya registrada');
    }

    entity.employeeId = employeeId;
    entity.typeId = payload.type.id;
    entity.registeredAt = currentDate;

    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    if (payload.type.code === 'entry')
      entity.late = this.validateEntryTime(employee, hours, minutes);

    if (payload.type.code === 'exit')
      entity.late = this.validateExitTime(employee, hours, minutes);

    console.log(payload.type.code)
    console.log(payload.type.code === 'lunch_exit')
    if (payload.type.code === 'lunch_exit')
      entity.late = false;

    if (payload.type.code === 'lunch_return')
      entity.late = await this.validateReturnLunch(employee, currentDate, employee.schedule.minutesLunch);

    return await this.repository.save(entity);
  }

  validateEntryTime(employee: any, hours: number, minutes: number) {
    if (hours > employee.schedule.hourStartedAt) {
      return true;
    } else {
      if (minutes > employee.schedule.minuteStartedAt) {
        return true;
      }
    }

    return false;
  }

  validateExitTime(employee: any, hours: number, minutes: number) {
    if (hours < employee.schedule.hourEndedAt) {
      return true;
    }

    if (hours == employee.schedule.hourEndedAt) {
      if (minutes < employee.schedule.minuteEndedAt) {
        return true;
      }
    }

    return false;
  }

  async validateReturnLunch(employee: any, currentDate: Date, minutesLunch: number) {
    const type = await this.catalogueRepository.findOne({ where: { code: 'lunch_exit' } });

    const attendances = await this.repository
      .createQueryBuilder('entity')
      .where('DATE(entity.registered_at) = :date AND employee_id = :employeeId AND type_id= :typeId',
        {
          date: format(currentDate, 'yyyy-MM-dd'),
          employeeId: employee.id,
          typeId: type.id,
        })
      .getMany();

    const registeredAt = new Date(attendances[0].registeredAt);
    const diffMinutes = differenceInMinutes(currentDate, registeredAt);
    console.log(registeredAt);
    console.log(attendances[0].registeredAt);
    console.log(diffMinutes);
    console.log(minutesLunch);

    return diffMinutes > minutesLunch;
  }

  // Encontrar una asistencia por ID
  async findOne(id: string): Promise<AttendanceEntity> {
    const entity = await this.repository.findOne({
      relations: { employee: true },
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

    entity.employeeId = payload.employeeId;
    entity.typeId = payload.typeId;
    entity.registeredAt = payload.registeredAt;
    entity.late = payload.late;

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
