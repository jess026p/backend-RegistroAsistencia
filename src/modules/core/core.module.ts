import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from '@database';
import { coreProviders } from '@core/providers';
import { AttendanceController } from './controllers/attendance.controller';
import {
  FormController,
  PermissionController,
  PermissionStateController,
  ScheduleController,
  SignerController, VacationController, VacationDetailController,
} from '@core/controllers';
import { AttendanceService } from './services/attendance.service';
import { FormService } from './services/form.service';
import { PermissionService } from './services/permission.service';
import { PermissionStateService } from './services/permission-state.service';
import { ScheduleService } from './services/schedule.service';
import { SignerService } from './services/signer.service';
import { VacationService } from './services/vacation.service';
import { VacationDetailService } from './services/vacation-detail.service';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeService } from './services/employee.service';

@Global()
@Module({
  imports: [DatabaseModule, CacheModule.register()],
  controllers: [
    AttendanceController,
    FormController,
    PermissionController,
    PermissionStateController,
    ScheduleController,
    SignerController,
    VacationController,
    VacationDetailController,
    EmployeeController
  ],
  providers: [
    ...coreProviders,
    AttendanceService,
    FormService,
    PermissionService,
    PermissionStateService,
    ScheduleService,
    SignerService,
    VacationService,
    VacationDetailService,
    EmployeeService
  ],
  exports: [...coreProviders],
})
export class CoreModule {}
