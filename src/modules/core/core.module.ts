import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from '@database';
import { coreProviders } from '@core/providers';
import { AttendanceController } from './controllers/attendance.controller';
import {
  FormController,
  PermissionController,
  PermissionStateController,
  HorarioController,
  SignerController, 
  VacationController, 
  VacationDetailController,
} from '@core/controllers';
import { AttendanceService } from './services/attendance.service';
import { FormService } from './services/form.service';
import { PermissionService } from './services/permission.service';
import { PermissionStateService } from './services/permission-state.service';
import { HorarioService } from './services/horario.service';
import { SignerService } from './services/signer.service';
import { VacationService } from './services/vacation.service';
import { VacationDetailService } from './services/vacation-detail.service';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeService } from './services/employee.service';
// Importamos los nuevos componentes
import { SiteController } from './controllers/site.controller';
import { SiteService } from './services/site.service';
import { AsistenciaController } from './controllers/asistencia.controller';
import { AsistenciaService } from './services/asistencia.service';
import { GeocodingController } from './controllers/geocoding.controller';
import { NotificacionController } from './controllers/notificacion.controller';
import { NotificacionService } from './services/notificacion.service';

@Global()
@Module({
  imports: [
    CacheModule.register(),
    DatabaseModule,
  ],
  controllers: [
    AttendanceController,
    FormController,
    PermissionController,
    PermissionStateController,
    HorarioController,
    SignerController,
    VacationController,
    VacationDetailController,
    EmployeeController,
    SiteController,
    AsistenciaController,
    GeocodingController,
    NotificacionController,
  ],
  providers: [
    ...coreProviders,
    AttendanceService,
    FormService,
    PermissionService,
    PermissionStateService,
    HorarioService,
    SignerService,
    VacationService,
    VacationDetailService,
    EmployeeService,
    SiteService,
    AsistenciaService,
    NotificacionService,
  ],
  exports: [
    ...coreProviders,
    AttendanceService,
    FormService,
    PermissionService,
    PermissionStateService,
    HorarioService,
    SignerService,
    VacationService,
    VacationDetailService,
    EmployeeService,
    SiteService,
    AsistenciaService,
    NotificacionService,
  ],
})
export class CoreModule {}