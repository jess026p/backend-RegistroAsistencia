import { Inject, Injectable } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { ConfigType } from '@nestjs/config';
import { config } from '@config';
import { ReportsSql } from './reports.sql';
import { attendanceTemplate } from '../templates/attendance.template';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportsSql: ReportsSql,
    private readonly printerService: PrinterService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  async generateLateAttendances(startedAt: Date, endedAt: Date) {
    try {
      const data = await this.reportsSql.findLateAttendances(startedAt, endedAt);

      console.log(data);

      return this.printerService.createPdf(attendanceTemplate(data));
    } catch (error) {
      throw new Error();
    }
  }
}
