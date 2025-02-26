import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AttendanceEntity, EmployeeEntity } from '@core/entities';
import { CoreRepositoryEnum } from '@shared/enums';
import { UserEntity } from '@auth/entities';

@Injectable()
export class ReportsSql {
  constructor(@Inject(CoreRepositoryEnum.ATTENDANCE_REPOSITORY) private readonly attendanceEntityRepository: Repository<AttendanceEntity>) {}

  async findLateAttendances(startedAt: Date, endedAt: Date): Promise<AttendanceEntity[]> {
    const attendances = await this.attendanceEntityRepository.createQueryBuilder('attendances')
      .select([
        'users.identification as "identification"',
        'users.lastname as "lastname"',
        'users.name as "name"',
        'attendances.registered_at as "registeredAt"',
      ])
      .innerJoin(EmployeeEntity, 'employees', 'employees.id = attendances.employee_id')
      .innerJoin(UserEntity, 'users', 'users.id = employees.user_id')
      .where('late = true')
      .getRawMany();

    //.where('evaluated_id = :evaluatedId and school_period_id = :schoolPeriodId and student_evaluations.total_score is not null',
    //         { evaluatedId, schoolPeriodId })

    return attendances;
  }
}
