import { ConfigEnum, CoreRepositoryEnum } from '@shared/enums';
import { DataSource } from 'typeorm';
import {
  AttendanceEntity,
  ScheduleEntity,
  PermissionEntity,
  PermissionTypeEntity,
  VacationEntity,
  FormEntity,
  PermissionStateEntity,
  VacationDetailEntity, SignerEntity,
} from '@core/entities';
import { EmployeeEntity } from '../entities/employee.entity';

export const coreProviders = [
  {
    provide: CoreRepositoryEnum.ATTENDANCE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AttendanceEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.SCHEDULE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ScheduleEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PERMISSION_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PermissionEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PERMISSION_TYPE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PermissionTypeEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.VACATION_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(VacationEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.FORM_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(FormEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PERMISSION_STATE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PermissionStateEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum. VACATION_DETAIL_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(VacationDetailEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.SIGNER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SignerEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },

  {
    provide: CoreRepositoryEnum.EMPLOYEE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(EmployeeEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },

];
